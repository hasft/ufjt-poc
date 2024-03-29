import { Context } from 'probot';
import path from 'path';
import { useSlackClient } from '../../utils.js';
import {
  getChannelsFromRepository,
  getPullRequestMessages,
  getSlackUserName, insertChildToConversation,
} from '../../requests.js';

// eslint-disable-next-line max-lines-per-function
export default async function commented({ payload }: Context<'pull_request_review_comment.created'>) {
  const { app, token } = useSlackClient();
  const { comment, pull_request } = payload;
  const { user, body, path: commentPath, html_url } = comment;
  const { user: prUser, base } = pull_request;
  const { repo } = base;
  const channels = await getChannelsFromRepository(repo.full_name);
  const ufjtUser = await getSlackUserName(user.id);

  if (!channels?.length) {
    return;
  }

  const pullRequestMessages = await getPullRequestMessages(channels, pull_request.id);

  if (!pullRequestMessages) {
    return;
  }

  await Promise.all(pullRequestMessages.map(async ({ channel, ts }) => {
    const { ts: childTs } = await app.client.chat.postMessage({
      text: '💬 Commented',
      blocks: [
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `@${ufjtUser || user.login} ${comment.user.id === prUser.id ? 'response' : 'reviewed'} _<${html_url}|${path.basename(commentPath)}>_`
            }
          ]
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `>_${body}_`
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