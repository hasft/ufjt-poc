import { colors, logger } from '@ufjt-poc/logger';
import introMessage from '../blocks/introMessage.js';
import { getConfig } from '../../utils.js';
import { AppHomeOpenedEventArgs } from '../../types';

// eslint-disable-next-line max-statements
export default async function onAppHomeOpened({ event, client, say }: AppHomeOpenedEventArgs): Promise<void> {
  logger.debug(colors.grey(event.type));
  const { channel } = event;
  const { appName } = getConfig();
  let messagesSize = 0;

  try {
    const { messages } = await client.conversations.history({
      channel,
      count: 1
    });

    messagesSize = messages?.length || 0;
  } catch (err) {
    messagesSize = 0;
  }

  if (messagesSize > 0) {
    logger.debug(`messages: ${messagesSize}`);
    return;
  }

  await say({
    blocks: introMessage(channel, appName),
    text: `Welcome to ${appName} 👋!`
  });
}
