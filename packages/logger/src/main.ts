import * as kleurColors from 'kleur/colors';
import { LoggerLevel, LoggerEvent, LoggerOptions } from './types';

export interface LogRecord {
  val: string;
  count: number;
}

const levels: Record<LoggerLevel, number> = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90,
};

const DEFAULT_NAME = 'ssr';

/** Custom logger heavily-inspired by
 * https://github.com/pinojs/pino with
 * extra features like log retentian */
class SsrLogger {
  /** set the log level (can be changed after init) */
  public level: LoggerLevel = 'info';

  public logName: string = DEFAULT_NAME;

  /** configure maximum number of logs to keep (default: 500) */
  public logCount = 500;

  // this is immutable; must be accessed with Logger.getHistory()
  private history: { val: string; count: number }[] = [];

  private callbacks: Record<LoggerEvent, (message: string) => void> = {
    debug: (message: string) => {
      console.log(message);
    },
    info: (message: string) => {
      console.log(message);
    },
    warn: (message: string) => {
      console.warn(message);
    },
    error: (message: string) => {
      console.error(message);
    },
  };

  // eslint-disable-next-line max-len
  // eslint-disable-next-line max-lines-per-function,complexity,max-statements
  private log({
    level,
    name,
    message,
    task,
  }: {
    level: LoggerEvent;
    name: string;
    message: string;
    task?: (ctx: SsrLogger) => void;
  }) {
    // test if this level is enabled or not
    if (levels[this.level] > levels[level]) {
      return;
    }

    // format
    let text = message;
    if (level === 'warn') {
      text = kleurColors.yellow(text);
    }
    if (level === 'error') {
      text = kleurColors.red(text);
    }
    const time = new Date();
    const log = `${kleurColors.dim(
      `[${String(time.getHours() + 1).padStart(2, '0')}:${String(
        time.getMinutes() + 1
      ).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}]`
    )} ${kleurColors.dim(`[${name}]`)} ${text}`;

    // add to log history and remove old logs to keep memory low
    const lastHistoryItem = this.history[this.history.length - 1];
    if (lastHistoryItem && lastHistoryItem.val === log) {
      lastHistoryItem.count++;
    } else {
      this.history.push({ val: log, count: 1 });
    }
    while (this.history.length > this.logCount) {
      this.history.shift();
    }

    // log
    if (typeof this.callbacks[level] === 'function') {
      this.callbacks[level](log);
    } else {
      throw new Error(`No logging method defined for ${level}`);
    }

    // logger takes a possibly processor-intensive task, and only
    // processes it when this log level is enabled
    if (task) {
      task(this);
    }
  }

  /** emit messages only visible when --debug is passed */
  public debug(message: string, options?: LoggerOptions): void {
    const name = (options && options.name) || this.logName;
    this.log({ level: 'debug', name, message, task: options?.task });
  }

  /** emit general info */
  public info(message: string, options?: LoggerOptions): void {
    const name = (options && options.name) || this.logName;
    this.log({ level: 'info', name, message, task: options?.task });
  }

  /** emit non-fatal warnings */
  public warn(message: string, options?: LoggerOptions): void {
    const name = (options && options.name) || this.logName;
    this.log({ level: 'warn', name, message, task: options?.task });
  }

  /** emit critical error messages */
  public error(message: string, options?: LoggerOptions): void {
    const name = (options && options.name) || this.logName;
    this.log({ level: 'error', name, message, task: options?.task });
  }

  /** get full logging history */
  public getHistory(): ReadonlyArray<LogRecord> {
    return this.history;
  }

  /** listen for events */
  // eslint-disable-next-line id-length
  public on(event: LoggerEvent, callback: (message: string) => void) {
    this.callbacks[event] = callback;
  }
}

/** export one logger to rest of app */
export const logger = new SsrLogger();
export const colors = kleurColors;
