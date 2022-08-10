import { Context } from 'probot';
import { useSlackClient } from '../../utils.js';
import {
  getChannelsFromRepository,
  getPullRequestMessages, insertChildToConversation
} from '../../requests.js';

export default async function sync({ payload }: Context<'pull_request.synchronize'>) {
  const { app, token } = useSlackClient();
  const { pull_request, repository } = payload;
  const channels = await getChannelsFromRepository(`${repository.owner.login}/${repository.name}`);

  if (!channels?.length) {
    return;
  }

  const pullRequestMessages = await getPullRequestMessages(channels, pull_request.id);

  if (!pullRequestMessages) {
    return;
  }

  await Promise.all(pullRequestMessages.map(async ({ channel, ts }) => {
    const { ts: childTs } = await app.client.chat.postMessage({
      text: '💬 Sync',
      blocks: [
        {
          'type': 'context',
          'elements': [
            {
              'type': 'mrkdwn',
              'text': '_synchronized..._'
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