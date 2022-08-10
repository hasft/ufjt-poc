import { Context } from 'probot';
import { logger } from '@ufjt-poc/logger';
import { getChannelsFromRepository, getPullRequestMessages } from '../../requests.js';
import { getErrorMessage, useSlackClient } from '../../utils.js';
import readyForReviewMessage from '../../slack/blocks/readyForReviewMessage.js';
import { getReviewer } from './utils.js';
import { createMessagePayload } from './readyForReview.js';

const reopened = async ({ payload }: Context<'pull_request.reopened'>) => {
  const { app, token } = useSlackClient();
  const { repository, pull_request } = payload;
  const { requested_reviewers } = pull_request;
  const channels = await getChannelsFromRepository(`${repository.owner.login}/${repository.name}`);

  if (!channels?.length) {
    return;
  }

  const pullRequestMessages = await getPullRequestMessages(channels, pull_request.id);

  if (!pullRequestMessages) {
    return;
  }

  const reviewers = await getReviewer(channels, requested_reviewers);

  if (!reviewers) {
    return;
  }
  const messageArguments = await createMessagePayload(pull_request, reviewers);

  try {
    await Promise.all(pullRequestMessages.map(async ({ channel, ts }) => {
      await app.client.chat.update({
        token,
        channel,
        text: `${pull_request.number} MERGED ⚡`,
        blocks: readyForReviewMessage(messageArguments),
        ts: ts
      });
    }));
  } catch (err) {
    logger.error(getErrorMessage(err));
  }
};

export default reopened;