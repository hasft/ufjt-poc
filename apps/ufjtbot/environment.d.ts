declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SLACK_SIGNING_SECRET: string;
      SLACK_BOT_TOKEN: string;
      SLACK_APP_LEVEL_TOKEN: string;
      NODE_ENV: 'prod' | 'dev';
      DB_USER: string;
      DB_PASSWORD: string;
      DB_CLUSTER_URL: string;
      GITHUB_CLIENT_SECRET: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_APP_ID: number;
      GITHUB_WEBHOOK_SECRET: string;
      GITHUB_PRIVATE_KEY: string;
    }
  }
}

export {};
