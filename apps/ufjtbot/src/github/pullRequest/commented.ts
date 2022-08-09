import { Context } from 'probot';
import { useSlackClient } from '../../utils.js';
import {
  getChannelsFromRepository,
  getPullRequestMessages,
  getSlackUserName,
} from '../../requests.js';

export default async function commented({ payload }: Context<'pull_request_review_comment.created'>) {
  const { app, token } = useSlackClient();
  const { comment, pull_request, repository } = payload;
  const { user, diff_hunk, body, path, position, html_url } = comment;
  const channels = await getChannelsFromRepository(`${repository.owner.login}/${repository.name}`);
  const content = diff_hunk.split('\n')?.[position as number];
  const ufjtUser = await getSlackUserName(user.id);

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
              'text': `@${ufjtUser || user.login}\n\`<${html_url}|${path}>\`\n\`\`\`${content}\`\`\`\n${body}`
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