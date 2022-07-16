import { RespondFn, SlashCommand } from '@slack/bolt';
import { logger } from '@ufjt-poc/logger';
import pleaseInstallMessage from '../blocks/pleaseInstallMessage.js';
import { octokit } from '../../global.js';
import { getErrorMessage, useDb } from '../../utils.js';
import { MatchedGroups } from '../../types';

interface SubscribeHandlerArguments {
  command: SlashCommand;
  respond: RespondFn;
}

// eslint-disable-next-line complexity,max-lines-per-function,max-statements
export default async function subscribeHandler({ command, respond }: SubscribeHandlerArguments) {
  let installationId: number | null = null;
  const { subscriptions } = useDb();
  const subReg = /^(?<action>sub)\s(?<owner>[a-zA-Z-]+)\/(?<repo>[a-zA-Z-]+)((?:\s--reviewers=)\((?<reviewers>@\w+(,\s@\w+)?)\))?$/;

  if (!subReg.test(command.text)) {
    return;
  }

  const { action, owner, repo, reviewers }: MatchedGroups = command.text.match(subReg)?.groups || {};

  if (action !== 'sub') {
    return;
  }

  try {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/installation', {
      owner,
      repo
    });
    installationId = data.id;
  } catch (err) {
    installationId = null;
  }

  if (!installationId) {
    await respond({
      text: 'not installed',
      blocks: pleaseInstallMessage({
        owner,
        repo,
        channel: command.channel_id,
        teamId: command.team_id,
        reviewers: reviewers?.replace(/[\s|@]/g, '')
      })
    });
    return;
  }

  try {
    const query = {
      repoFullName: `${owner}/${repo}`,
      channelId: command.channel_id,
      teamId: command.team_id,
    };
    const updater = {
      $set: { ...query, installationId: installationId }
    };

    await subscriptions.findOneAndUpdate(query, updater, { upsert: true });
  } catch (err) {
    logger.error(getErrorMessage(err));
  }

  await respond({
    text: '🌈 Subscribed'
  });
}