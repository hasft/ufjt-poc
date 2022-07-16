import { AllMiddlewareArgs, SlackViewMiddlewareArgs } from '@slack/bolt';
import User from '../../user.js';
import connectedMessage from '../blocks/connectedMessage.js';
import { getUser } from '../../requests.js';
import { getConfig } from '../../utils.js';

type OnSubmitGithubCodeArgs = SlackViewMiddlewareArgs & AllMiddlewareArgs;

// eslint-disable-next-line complexity,max-statements
export default async function onSubmitGithubCode({ ack, view, respond, body }: OnSubmitGithubCodeArgs): Promise<void> {
  await ack();
  const config = getConfig();
  const { value: code } = view.state.values['input_oauth_code']['send_oauth_code'] as { value: string };
  const user = await getUser(body.user);

  if (!!user) {
    return;
  }

  const newUser = new User({
    sName: body.user.name,
    sId: body.user.id,
    tId: body.user.team_id as string
  });

  await newUser.authOauthUser(code);
  await newUser.save();

  const newUserData = newUser.getCurrentData();

  if ('gName' in newUserData && 'gUrl' in newUserData) {
    await respond({
      text: 'Connected 🦓',
      blocks: connectedMessage({
        sName: newUserData.sName,
        gName: newUserData.gName,
        gUrl: newUserData.gUrl,
        command: config.command
      })
    });
  }
}