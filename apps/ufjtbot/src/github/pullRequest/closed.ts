import { Context } from 'probot';
import { logger } from '@ufjt-poc/logger';
import { getErrorMessage, useSlackClient } from '../../utils.js';
import { getChannelsFromRepository, getPullRequestMessages } from '../../requests.js';
import mergedMessage from '../../slack/blocks/mergedMessage.js';

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
    await Promise.all(pullRequestMessages.map(async ({ channel, ts }) => {
      await app.client.chat.update({
        token,
        channel,
        text: `${pull_request.number} MERGED ⚡`,
        blocks: mergedMessage({
          url: html_url,
          title: title,
          state: merged ? 'merged' : 'closed',
          user: sender.login,
          branch: base.ref
        }),
        ts: ts
      });
    }));
  } catch (err) {
    logger.error(getErrorMessage(err));
  }

}