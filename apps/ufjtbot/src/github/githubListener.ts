import { ApplicationFunction, createNodeMiddleware, Probot as Github } from 'probot';
import { Express } from 'express';
import { colors, logger } from '@ufjt-poc/logger';
import { GithubListeners } from '../types';

export default class GithubListener {
  private app: Github;
  private listeners?: ApplicationFunction;
  private appServer: Express;
  private webhookPath: string;

  constructor(app: Github, webhookPath: string, appServer: Express) {
    this.app = app;
    this.appServer = appServer;
    this.webhookPath = webhookPath;
  }

  async start(): Promise<boolean> {
    if (!this.listeners) {
      return false;
    }

    this.appServer.use(createNodeMiddleware(this.listeners, {
      probot: this.app,
      webhooksPath: this.webhookPath
    }));

    return Promise.resolve(true);
  }

  register(listeners: GithubListeners) {
    this.listeners = (app) => {
      listeners.map(listener => {
        if (listener.setup) {
          return app.on(listener.name, async (ctx) => {
            // @ts-ignore
            await listener.setup(ctx);
            await listener.handler(ctx);
          });
        }

        return app.on(listener.name, listener.handler);
      });

      app.onAny( (context) => {
        if ('action' in context.payload) {
          logger.debug(colors.grey(JSON.stringify({ name: context.name, action: context.payload.action }, null, 2)));
        }
      });
    };
  }
}