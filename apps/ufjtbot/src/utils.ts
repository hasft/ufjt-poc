import path from 'path';
import fs from 'fs-extra';
import { db, github, receiver, slack } from './global.js';
import { Config, UseGithubClient, UseSlackClient } from './types';

/**
 * typescript helper to guard and get error message from Error instance
 * @param error
 */
export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function normalizeConfig(config: Config): Config {
  return {
    ...config,
    mode: process.env.NODE_ENV || 'dev',
    jwtAlgorithm: 'RS256',
  };
}

/**
 * GET all ufjtbot config
 */
export const getConfig = (): Config => {
  const config = (fs.readJsonSync(path.join(process.cwd(), 'config.json'))) as unknown as Config;
  return normalizeConfig(config);
};

/**
 * Return most prop that will use by slack client
 */
export const useSlackClient = (): UseSlackClient => {
  return {
    receiver,
    app: slack,
    client: slack.client,
    token: process.env.SLACK_BOT_TOKEN
  };
};

export const useGithubClient = (): UseGithubClient => {
  return {
    app: github
  };
};

/**
 * Return most prop that will use by mongo client
 */
export const useDb = () => {
  const ufjt = db.db('ufjt');
  return {
    db: ufjt,
    subscriptions: ufjt.collection('subscriptions'),
    users: ufjt.collection('users'),
    conversations: ufjt.collection('conversations')
  };
};