import { AllMiddlewareArgs, SlackViewMiddlewareArgs } from '@slack/bolt';
import { octokit } from '../../global.js';
import pleaseInstallMessage from '../blocks/pleaseInstallMessage.js';
import { logger } from '@ufjt-poc/logger';
import { getErrorMessage, useDb } from '../../utils.js';
import { MatchedGroups } from '../../types';

type OnSetReviewers = SlackViewMiddlewareArgs & AllMiddlewareArgs;

const updateSubscriptionReviewer = async ({ owner, repo, channel, teamId, installationId, reviewers }: {
  owner: string;
  repo: string;
  channel: string;
  teamId: string;
  installationId: number;
  reviewers: Set<string>
}) => {
  const { subscriptions } = useDb();
  try {
    const query = {
      repoFullName: `${owner}/${repo}`,
      channelId: channel,
      teamId,
    };
    const updater = {
      $set: { ...query, installationId: installationId, reviewers: Array.from(reviewers) }
    };

    await subscriptions.findOneAndUpdate(query, updater, { upsert: true });
  } catch (err) {
    logger.error(getErrorMessage(err));
  }
};

const getReviewers = async (selectedUsers: string[], client: OnSetReviewers['client']): Promise<Set<string>> => {
  const reviewers: Set<string> = new Set();

  try {
    const res = await Promise.all(selectedUsers.map(async (user) => {
      return await client.users.info({
        user
      });
    }));
    if (res) {
      res.forEach(reviewer => {
        if (!reviewer?.user?.name) {
          return;
        }
        reviewers.add(reviewer.user.name);
      });
    }
  } catch (err) {
    logger.error(getErrorMessage(err));
  }

  return reviewers;
};

const getInstallationId = async (owner: string, repo: string): Promise<number | null> => {
  let installationId: number | null;
  try {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/installation', {
      owner,
      repo
    });
    installationId = data.id;
  } catch (err) {
    installationId = null;
  }

  return installationId;
};

export default async function onSetReviewers({ ack, view, respond, client, payload }: OnSetReviewers) {
  await ack();
  const { value: repoFullName } = view.state.values['input_repository']['set_repository_name'] as { value: string };
  const { selected_users } = view.state.values['select_reviewer']['set_reviewer'] as { type: string, selected_users: string[] };
  const { selected_channel: channel } = view.state.values['mention_channel_select']['channel_select_id'] as { selected_channel: string };
  const subReg = /^(?<owner>[a-zA-Z-]+)\/(?<repo>[a-zA-Z-]+)$/;
  const { owner, repo }: MatchedGroups = repoFullName.match(subReg)?.groups || {};

  if (!subReg.test(repoFullName) && !selected_users.length) {
    return;
  }

  const reviewers = await getReviewers(selected_users, client);
  const installationId = await getInstallationId(owner, repo);

  if (!installationId) {
    await respond({
      text: 'not installed',
      blocks: pleaseInstallMessage({
        owner,
        repo,
        channel: channel,
        teamId: payload.team_id,
        reviewers: Array.from(reviewers).join(',')
      })
    });

    return;
  }

  await updateSubscriptionReviewer({
    owner,
    channel,
    repo,
    teamId: view.team_id,
    installationId,
    reviewers
  });

  await respond({
    text: `🌈 Now ${repoFullName} activity will mentioned to: ${Array.from(reviewers).map(reviewer => `<@${reviewer}>`)
      .join(' | ')}`
  });
}