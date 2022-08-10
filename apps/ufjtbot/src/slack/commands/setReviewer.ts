import { AllMiddlewareArgs, RespondFn, SlackCommandMiddlewareArgs, SlashCommand } from '@slack/bolt';
import setReviewerMessage from '../blocks/setReviewerMessage.js';

interface SetReviewerArguments {
  command: SlashCommand;
  respond: RespondFn;
  client: AllMiddlewareArgs['client'];
  body: SlackCommandMiddlewareArgs['body']
}

export default async function setReviewer({ command, body, client }: SetReviewerArguments) {
  const setReviewerReg = /^(?<action>mentions)(\s)?$/;

  if (!setReviewerReg.test(command.text)) {
    return;
  }

  await client.views.open({
    trigger_id: body.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'onSetReviewers',
      title: {
        type: 'plain_text',
        text: 'Set default reviewers'
      },
      blocks: setReviewerMessage({
        channel: command.channel_id
      }),
      submit: {
        type: 'plain_text',
        text: 'Submit'
      }
    }
  });
}