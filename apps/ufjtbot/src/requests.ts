import { WithId } from 'mongodb';
import { getErrorMessage, useDb } from './utils.js';
import { Chat, Conversation, GetUserArgs, Subscriber, UfjtUser } from './types';
import { logger } from '@ufjt-poc/logger';
import { Context } from 'probot';

/**
 * Mostly all notifier need this helper since slack postMessage API require channelId
 * @param {String} fullName
 */
export const getChannelsFromRepository = async (fullName: string): Promise<WithId<Subscriber>[] | null> => {
  const { subscriptions } = useDb();
  const query = {
    repoFullName: fullName,
  };

  try {
    return await subscriptions.find(query)
      .toArray() as unknown as WithId<Subscriber>[];
  } catch (err) {
    return null;
  }
};

/**
 * GET UFJT user from slack payload
 * @param {GetUserArgs} user
 */
export const getUser = async (user: GetUserArgs): Promise<WithId<UfjtUser> | null> => {
  const { users } = useDb();
  const query = {
    sId: user.id,
    tId: user.team_id,
    sName: user.name,
  };

  try {
    return await users.findOne(query) as unknown as WithId<UfjtUser>;
  } catch (err) {
    return null;
  }
};

/**
 * INSERT USER to db.
 * @param user
 */
export const createUser = async (user: UfjtUser): Promise<WithId<UfjtUser> | null> => {
  const { users } = useDb();
  const query = {
    sId: user.sId,
    gId: user.gId,
    sName: user.sName,
    gName: user.gName,
    tId: user.tId,
    gUrl: user.gUrl,
  };

  try {
    const { insertedId } = await users.insertOne(query);
    return { ...query, _id: insertedId };
  } catch (err) {
    return null;
  }
};

/**
 * Get pull request messages.
 * @param channels
 * @param pull_request
 */
export async function getPullRequestMessages(channels: WithId<Subscriber>[], pull_request: number): Promise<WithId<Conversation>[] | null> {
  const { conversations } = useDb();
  let pullRequestMessages = null;
  try {
    const messages = await Promise.all(channels.map(async ({ channelId }) => {
      const query = {
        channel: channelId,
        pull_request
      };

      return await conversations.findOne(query) as unknown as WithId<Conversation>;
    }));

    pullRequestMessages = messages || null;
  } catch (err) {
    logger.error(getErrorMessage(err));
  }

  return pullRequestMessages;
}

export async function getSlackUserName(gId: number) {
  let slackUser;
  const { users } = useDb();

  try {
    const query = {
      gId
    };

    const ufjtUser = await users.findOne(query) as unknown as WithId<UfjtUser>;
    slackUser = ufjtUser.sName;
  } catch (err) {
    logger.error(getErrorMessage(err));
    return null;
  }

  return slackUser;
}

export async function getSlackReviewersUserName(requested_reviewers: Context<'pull_request'>['payload']['pull_request']['requested_reviewers']): Promise<string[] | null> {
  let userReviewers: string[] = [];
  const { users } = useDb();

  try {
    userReviewers = await Promise.all(requested_reviewers.map(async (reviewer) => {
      const query = {
        gId: reviewer.id
      };

      const ufjtUser = await users.findOne(query) as unknown as WithId<UfjtUser>;
      if (!ufjtUser && 'login' in reviewer) {
        return reviewer.login;
      }
      return ufjtUser.sName;
    }));
  } catch (err) {
    logger.error(getErrorMessage(err));
    return null;
  }

  return userReviewers;
}

export async function addConversation(chats: Chat[], pullRequestId: number) {
  const { conversations } = useDb();
  try {
    await Promise.all(chats.map(async (chat) => {
      const query = {
        ts: chat.ts,
        channel: chat.channel,
        pull_request: pullRequestId
      };
      return await conversations.insertOne(query);
    }));
  } catch (err) {
    logger.error(getErrorMessage(err));
  }
}

export async function removeConversation(chat: Chat) {
  const { conversations } = useDb();
  const query = {
    channel: chat.channel,
    ts: chat.ts
  };
  try {
    await conversations.deleteOne(query);
  } catch (err) {
    logger.error(getErrorMessage(err));
  }
}