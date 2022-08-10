import { Context } from 'probot';
import { WithId } from 'mongodb';
import readyForReviewMessage from '../../slack/blocks/readyForReviewMessage.js';
import { addConversation, getChannelsFromRepository, getSlackUserName } from '../../requests.js';
import { useSlackClient } from '../../utils.js';
import { ReadyForReviewMessageArguments, Subscriber } from '../../types';
import { getReviewer } from './utils.js';

interface JiraMatchedGroups {
  jiraName: string;
  jiraLink: string;
}

// eslint-disable-next-line max-lines-per-function
export const createMessagePayload = async (
  pullRequest: Context<'pull_request.ready_for_review' | 'pull_request.reopened'>['payload']['pull_request'],
  reviewers: Set<string>
): Promise<ReadyForReviewMessageArguments> => {
  const {
    title,
    html_url: htmlUrl,
    user,
    body,
    head,
    base,
    labels,
    number,
    commits,
    updated_at: time,
    changed_files: fileChangedSize,
    mergeable_state: status,
  } = pullRequest;
  const jiraReg = /jira:\s(?:__|[*#])|\[(?<jiraName>(.*?))\]\((?<jiraLink>.*?)\)/;
  const { jiraLink, jiraName }: JiraMatchedGroups = body?.match(jiraReg)?.groups as unknown as JiraMatchedGroups || {};
  const { login: author } = user;
  const { ref: originBranch, user: headUser } = head;
  const { html_url: ownerUrl } = headUser;
  const { repo: baseRepo, ref: targetBranch } = base;
  const {
    html_url: targetBranchUrl
  } = baseRepo;
  const ufjtUser = await getSlackUserName(user.id);

  return {
    title,
    htmlUrl,
    number,
    author: ufjtUser || author,
    commits,
    targetBranch,
    targetBranchUrl,
    originBranch,
    originBranchUrl: `${ownerUrl}/${originBranch}`,
    time,
    fileChangedSize,
    status,
    files: [],
    labels: labels.map(label => label.name),
    reviewers: Array.from(reviewers),
    jiraName,
    jiraLink
  };
};

const getChats = async (channels: WithId<Subscriber>[], messageArguments: ReadyForReviewMessageArguments) => {
  const { client, token } = useSlackClient();

  try {
    return await Promise.all(channels.map(async ({ channelId }) => {
      const message = await client.chat.postMessage({
        token,
        channel: channelId,
        text: '😱 New Pull Request! "Ready For Review"',
        blocks: readyForReviewMessage(messageArguments)
      });

      return {
        channel: message.channel as string,
        ts: message.ts as string,
      };
    }));
  } catch (err) {
    return null;
  }
};

/**
 * This is the main one why ufjtbot created.
 * A notifier when pullRequest marked as 'Ready for review'
 * @param payload
 */
const readyForReview = async ({ payload }: Context<'pull_request.ready_for_review'>) => {
  const { repository, pull_request } = payload;
  const {
    id: pullRequestId,
    requested_reviewers,
  } = pull_request;
  const channels = await getChannelsFromRepository(`${repository.owner.login}/${repository.name}`);

  if (!channels) {
    return;
  }
  const reviewers = await getReviewer(channels, requested_reviewers);

  if (!reviewers) {
    return;
  }
  const messageArguments = await createMessagePayload(pull_request, reviewers);
  const chats = await getChats(channels, messageArguments);

  if (!chats) {
    return;
  }

  await addConversation(chats, pullRequestId);
};

export default readyForReview;