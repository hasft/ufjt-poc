import 'dotenv/config';
import { logger } from '@ufjt-poc/logger';
import app from './app.js';
import { getConfig } from './utils.js';

// eslint-disable-next-line @typescript-eslint/require-await,max-statements,max-lines-per-function
async function main() {
  const config = getConfig();
  logger.level = config.logLevel;
  await app();
}

main()
  .catch(err => {
    if (err instanceof Error) {
      logger.debug(err.message);
      throw new Error(err.message);
    }
  });