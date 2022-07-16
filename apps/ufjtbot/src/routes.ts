import { logger } from '@ufjt-poc/logger';
import { getErrorMessage, useDb, useSlackClient } from './utils.js';
import { ServerRoutes } from './types';

const routes: ServerRoutes = {
  '/login/oauth2/code/github': {
    handler: (req, res) => {
      const { code } = req.query;

      res.render('auth-code', { title: 'Copy code', code: code });
    }
  },
  '/post-install': {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises,complexity,max-statements
    handler: async (req, res) => {
      const { subscriptions } = useDb();
      const { app } = useSlackClient();
      const { installation_id, setup_action, state } = req.query;

      if (!state) {
        return res.end();
      }

      const [repoFullName, channelId, teamId, reviewers] = state.toString().split('--');

      if (setup_action === 'install') {
        const query = {
          repoFullName,
          channelId,
          teamId
        };
        const updater = {
          $set: { ...query, installationId: parseInt(installation_id as string, 10), reviewers }
        };

        try {
          await subscriptions.findOneAndUpdate(query, updater, { upsert: true });
        } catch (err) {
          logger.error(getErrorMessage(err));
        }
      }

      try {
        await app.client.chat.postMessage({
          channel: channelId,
          token: process.env.SLACK_BOT_TOKEN,
          text: `${repoFullName} now subscribe to this channel`
        });
      } catch (err) {
        logger.error(getErrorMessage(err));
      }

      return res.end();
    }
  }
};

export default routes;