import { Context } from 'probot';
import { useSlackClient } from '../../utils.js';
import { getChannelsFromRepository, getPullRequestMessages } from '../../requests.js';

export default async function commented({ payload }: Context<'pull_request_review_comment.created'>) {
  const { app, token } = useSlackClient();
  const { comment, pull_request, repository } = payload;
  const { user, diff_hunk, body, path, line } = comment;
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
      text: '💬 Commented',
      blocks: [
        {
          'type': 'context',
          'elements': [
            {
              'type': 'mrkdwn',
              'text': `${user.login}\n\`${path}\`\n\`\`\`${diff_hunk}\`\`\`\n${body}`
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