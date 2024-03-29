import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import subscribeHandler from './subscribeHandler.js';
import unsubscribeHandler from './unsubscribeHandler.js';

export type OnUFJTCommand = SlackCommandMiddlewareArgs & AllMiddlewareArgs;

/**
 * core slash command handler
 * @param ack
 * @param command
 * @param respond
 */
// eslint-disable-next-line complexity,max-lines-per-function,max-statements
export default async function onUFJTCommand({ ack, command, respond }: OnUFJTCommand): Promise<void> {
  await ack();
  const [commandAction] = command.text.split(' ');

  switch (commandAction) {
    case 'sub':
      await subscribeHandler({ command, respond });
      break;
    case 'unsub':
      await unsubscribeHandler({ command, respond });
      break;
    default:
      break;
  }
}