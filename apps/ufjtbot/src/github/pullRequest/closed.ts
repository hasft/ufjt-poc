import { Context } from 'probot';
import { logger } from '@ufjt-poc/logger';
import { getErrorMessage, useSlackClient } from '../../utils.js';
import { getChannelsFromRepository, getPullRequestMessages, removeConversation } from '../../requests.js';
import mergedMessage from '../../slack/blocks/mergedMessage.js';

// eslint-disable-next-line max-lines-per-function
export default async function closed({ payload }: Context<'pull_request.closed'>) {
  const { app, token } = useSlackClient();
  const { repository, pull_request, sender } = payload;
  const { title, html_url, base, merged } = pull_request;

  const channels = await getChannelsFromRepository(`${repository.owner.login}/${repository.name}`);

  if (!channels?.length) {
    return;
  }

  const pullRequestMessages = await getPullRequestMessages(channels, pull_request.id);

  if (!pullRequestMessages) {
    return;
  }

  try {
    await Promise.all(pullRequestMessages.map(async ({ channel, ts, child }) => {
      await app.client.chat.update({
        token,
        channel,
        text: `${pull_request.number} MERGED ⚡`,
        blocks: mergedMessage({
          url: html_url,
          title: title,
          state: merged ? 'merged' : 'closed',
          user: sender.login,
          branch: base.ref,
          number: pull_request.number
        }),
        ts: ts
      });
      if (child.length) {
        await Promise.all(child.map(async (childTs) => {
          await app.client.chat.delete({
            token,
            channel,
            ts: childTs
          });
        }));
      }
      await removeConversation({ channel, ts });
    }));
  } catch (err) {
    logger.error(getErrorMessage(err));
  }
}