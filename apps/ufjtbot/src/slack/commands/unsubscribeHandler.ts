import { RespondFn, SlashCommand } from '@slack/bolt';
import { logger } from '@ufjt-poc/logger';
import { getErrorMessage, useDb } from '../../utils.js';
import { MatchedGroups } from '../../types';

interface UnsubscribeHandlerArguments {
  command: SlashCommand;
  respond: RespondFn;
}

export default async function unsubscribeHandler({ command, respond }: UnsubscribeHandlerArguments) {
  const { subscriptions } = useDb();
  const unsubReg = /^(?<action>unsub)\s(?<owner>[a-zA-Z-]+)\/(?<repo>[a-zA-Z-]+)(\s)?$/;

  if (!unsubReg.test(command.text)) {
    return;
  }

  const { owner, repo }: MatchedGroups = command.text.match(unsubReg)?.groups || {};

  try {
    const query = {
      repoFullName: `${owner}/${repo}`,
      channelId: command.channel_id,
      teamId: command.team_id
    };
    await subscriptions.deleteOne(query);
  } catch (err) {
    logger.error(getErrorMessage(err));
  }

  await respond({
    text: '💀 unsubscribed'
  });
}