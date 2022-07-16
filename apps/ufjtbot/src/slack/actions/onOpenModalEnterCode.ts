import { AllMiddlewareArgs, SlackActionMiddlewareArgs } from '@slack/bolt';
import { logger } from '@ufjt-poc/logger';
import modalFormOauthCode from '../blocks/modalFormOauthCode.js';
import { getErrorMessage } from '../../utils.js';

type OnOpenModalEnterCodeArgs = SlackActionMiddlewareArgs & AllMiddlewareArgs

/**
 * Handler when user want to connect to github by code.
 * This serve as simple as Opening modal.
 * @param ack
 * @param body
 * @param client
 */
export default async function onOpenModalEnterCode({ ack, body, client } : OnOpenModalEnterCodeArgs): Promise<void> {
  await ack();
  if (body.type !== 'dialog_submission') {
    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'onSubmitGithubCode',
          title: {
            type: 'plain_text',
            text: 'Complete authentication'
          },
          blocks: modalFormOauthCode(),
          submit: {
            type: 'plain_text',
            text: 'Submit'
          }
        }
      });
    } catch (err) {
      logger.error(getErrorMessage(err));
    }
  }
  return Promise.resolve();
}
