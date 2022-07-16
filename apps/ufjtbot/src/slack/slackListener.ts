import {
  App as Slack,
  Middleware,
  SlackActionMiddlewareArgs, SlackCommandMiddlewareArgs, SlackViewMiddlewareArgs,
} from '@slack/bolt';
import { SlackEventMiddlewareArgs } from '@slack/bolt/dist/types';
import { SlackListeners } from '../types';

/**
 * SlackListener class is a controller of slack instance listener
 */
export default class SlackListener {
  private readonly app: Slack;
  constructor(instance: Slack) {
    this.app = instance;
  }

  /**
   * slack deferring initialization
   */
  async start() {
    await this.app.init();
  }

  /**
   * A place to handling listener. do anything in here.
   * @param listeners
   */
  register(listeners: SlackListeners) {
    const app = this.app;
    // eslint-disable-next-line complexity
    listeners.map((listener) => {
      // assumed app is Slack Instance
      if ('event' in listener) {
        return app.event(listener.name, listener.event as unknown as Middleware<SlackEventMiddlewareArgs>);
      }

      if ('action' in listener) {
        return app.action(listener.name, listener.action as unknown as Middleware<SlackActionMiddlewareArgs>);
      }

      if ('view' in listener) {
        return app.view(listener.name, listener.view as unknown as Middleware<SlackViewMiddlewareArgs>);
      }

      if ('command' in listener) {
        return app.command(listener.name, listener.command as unknown as Middleware<SlackCommandMiddlewareArgs>);
      }

      return false;
    });
  }
}

