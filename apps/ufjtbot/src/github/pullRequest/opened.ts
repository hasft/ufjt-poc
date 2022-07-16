import { Context } from 'probot';
import { logger } from '@ufjt-poc/logger';
import { getErrorMessage } from '../../utils.js';
import { Endpoints } from '@octokit/types';

/**
 * A notifier for pull request opened. triggered after PR -> draft.
 * the message is targeting to message ts by pullRequest ID
 * @param payload
 * @param octokit
 */
// eslint-disable-next-line complexity,max-lines-per-function,max-statements
export default async function opened({ payload, octokit }: Context<'pull_request.opened'>) {
  const collaborators: Endpoints['GET /repos/{owner}/{repo}/collaborators']['response']['data'] = [];
  const { pull_request: pullRequest, repository } = payload;

  if (!pullRequest.labels.length) {
    try {
      await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/labels', {
        owner: repository.owner.login,
        repo: repository.name,
        issue_number: pullRequest.number,
        labels: ['help wanted']
      });
    } catch (err) {
      logger.error(getErrorMessage(err));
    }
  }

  if (!pullRequest.requested_reviewers.length) {
    try {
      const { data } = await octokit.request('GET /repos/{owner}/{repo}/collaborators', {
        owner: repository.owner.login,
        repo: repository.name
      });
      data.forEach(collaborator => {
        collaborators.push(collaborator);
      });
    } catch (err) {
      logger.error(getErrorMessage(err));
    }

    if (!collaborators.length) {
      return;
    }

    try {
      await octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers', {
        owner: repository.owner.login,
        repo: repository.name,
        pull_number: pullRequest.number,
        reviewers: collaborators.filter(reviewer => reviewer.login !== pullRequest.user.login).map(user => user.login)
      });
    } catch (err) {
      logger.error(getErrorMessage(err));
    }
  }
}