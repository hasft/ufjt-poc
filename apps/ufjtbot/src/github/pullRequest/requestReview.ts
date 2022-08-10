import { Context } from 'probot';
import { useSlackClient } from '../../utils.js';
import {
  getChannelsFromRepository,
  getPullRequestMessages,
  insertChildToConversation,
} from '../../requests.js';
import { getReviewer } from './utils.js';

// eslint-disable-next-line max-lines-per-function
export default async function requestReview({ payload }: Context<'pull_request.review_requested'>) {
  const { app, token } = useSlackClient();
  const { pull_request, repository } = payload;
  const { draft, requested_reviewers } = pull_request;
  const channels = await getChannelsFromRepository(`${repository.owner.login}/${repository.name}`);
  const reviewers = await getReviewer(channels, requested_reviewers);

  if (!channels?.length || draft || !reviewers) {
    return;
  }

  const pullRequestMessages = await getPullRequestMessages(channels, pull_request.id);

  if (!pullRequestMessages) {
    return;
  }

  await Promise.all(pullRequestMessages.map(async ({ channel, ts }) => {
    const { ts: childTs } = await app.client.chat.postMessage({
      text: '💬 Request Reviewer',
      blocks: [
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Please review: ${
                Array.from(reviewers)
                  .map(reviewer => `@${reviewer}`)
                  .join(', ')
              }`
            }
          ]
        }
      ],
      thread_ts: ts,
      channel,
      token
    });
    await insertChildToConversation({ channel, ts }, childTs as string);
  }));
}