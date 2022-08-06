import { Context } from 'probot';
import { useSlackClient } from '../../utils.js';
import {
  getChannelsFromRepository,
  getPullRequestMessages
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
    await app.client.chat.postMessage({
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
  }));
}