import { Context } from 'probot';
import editedMessage from '../../slack/blocks/editedMessage.js';
import { useSlackClient } from '../../utils.js';
import { getChannelsFromRepository, getPullRequestMessages } from '../../requests.js';

/**
 * A notifier for pull request edited.
 * the message is targeting to message ts by pullRequest ID
 * @param {Context} payload
 */
export default async function edited({ payload }: Context<'pull_request.edited'>) {
  const { app, token } = useSlackClient();
  const { pull_request, changes, sender } = payload;
  const channels = await getChannelsFromRepository(pull_request.base.repo.full_name);

  if (!channels?.length) {
    return;
  }

  const pullRequestMessages = await getPullRequestMessages(channels, pull_request.id);

  if (!pullRequestMessages) {
    return;
  }

  await Promise.all(pullRequestMessages.map(async ({ channel, ts }) => {
    await app.client.chat.postMessage({
      token,
      channel,
      text: 'Edited 👋',
      blocks: editedMessage(Object.keys(changes).join(','), sender.login),
      thread_ts: ts
    });
  }));
}