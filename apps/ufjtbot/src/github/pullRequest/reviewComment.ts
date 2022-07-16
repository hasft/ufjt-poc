import { Context } from 'probot';
import { useSlackClient } from '../../utils.js';
import { getChannelsFromRepository, getPullRequestMessages } from '../../requests.js';

/**
 * A notifier when there's commented pr
 * @param payload
 */
// eslint-disable-next-line max-lines-per-function
export default async function reviewComment({ payload }: Context<'pull_request_review_comment'>) {
  const { app, token } = useSlackClient();
  const { repository, pull_request, comment } = payload;
  const channels = await getChannelsFromRepository(`${repository.owner.login}/${repository.name}`);

  if (!channels?.length) {
    return;
  }

  const pullRequestMessages = await getPullRequestMessages(channels, pull_request.id);

  if (!pullRequestMessages) {
    return;
  }

  await Promise.all(pullRequestMessages.map(async ({ channel, ts }) => {
    await app.client.chat.postMessage({
      text: '🌈 Review added',
      blocks: [
        {
          'type': 'context',
          'elements': [
            {
              'type': 'mrkdwn',
              'text': `*Review added:* \n ${comment.body}\n<${comment._links.html.href}|link>`
            }
          ]
        }
      ],
      thread_ts: ts,
      channel,
      token
    });
  }));
}