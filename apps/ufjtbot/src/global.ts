import bolt from '@slack/bolt';
import { Probot } from 'probot';
import { MongoClient } from 'mongodb';
import { Octokit } from '@octokit/core';
import { createAppAuth } from '@octokit/auth-app';

const { ExpressReceiver, App: Slack } = bolt;

export const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: '/slack/events'
});

export const slack = new Slack({
  deferInitialization: true,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_LEVEL_TOKEN,
  receiver
});

export const github = new Probot({
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_PRIVATE_KEY,
  secret: process.env.GITHUB_WEBHOOK_SECRET
});

const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}` +
  `@${process.env.DB_CLUSTER_URL}/?retryWrites=true&w=majority`;

export const db = new MongoClient(dbUrl);

export const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_PRIVATE_KEY,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }
});