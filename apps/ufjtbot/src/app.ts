import * as http from 'http';
import express from 'express';
import { colors, logger } from '@ufjt-poc/logger';
import { githubListeners, slackListeners } from './listeners.js';
import SlackListener from './slack/slackListener.js';
import GithubListener from './github/githubListener.js';
import routes from './routes.js';
import { db } from './global.js';
import { getConfig, getErrorMessage, useGithubClient, useSlackClient } from './utils.js';

// eslint-disable-next-line max-statements,max-lines-per-function
const app = async () => {
  const { app: slack, receiver } = useSlackClient();
  const { app: github } = useGithubClient();
  const config = getConfig();

  const expressApp = express();
  const serverApp = http.createServer(expressApp);

  const slackListener = new SlackListener(slack);
  const githubListener = new GithubListener(github, config.githubWebhookPath, expressApp);

  await db.close();
  await db.connect();

  slackListener.register(slackListeners);
  githubListener.register(githubListeners);

  await slackListener.start();
  await githubListener.start();

  expressApp.use(receiver.router);
  expressApp.set('view engine', 'pug');

  Object.keys(routes).map(route => {
    return expressApp.use(route, routes[route].handler);
  });

  serverApp.listen(config.port, () => {
    logger.info(colors.green(`Running express server at port ${config.port}`));
  });

  // HANDLE SIGTERM PROCESS
  process.on('SIGTERM', () => {
    db.close()
      .then(() => {
        serverApp.close();
      })
      .catch(err => {
        logger.error(getErrorMessage(err));
      });
  });
};

export default app;