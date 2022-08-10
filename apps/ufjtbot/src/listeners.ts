import onAppHomeOpened from './slack/events/onAppHomeOpened.js';
import onOpenModalEnterCode from './slack/actions/onOpenModalEnterCode.js';
import onSubmitGithubCode from './slack/views/onSubmitGithubCode.js';
import onUFJTCommand from './slack/commands/onUFJTCommand.js';
import readyForReview from './github/pullRequest/readyForReview.js';
import opened from './github/pullRequest/opened.js';
import edited from './github/pullRequest/edited.js';
import closed from './github/pullRequest/closed.js';
import reviewSubmitted from './github/pullRequest/reviewSubmitted.js';
import commented from './github/pullRequest/commented.js';
import sync from './github/pullRequest/sync.js';
import requestReview from './github/pullRequest/requestReview.js';
import { GithubListeners, SlackListeners } from './types';

export const slackListeners: SlackListeners = [
  {
    name: 'app_home_opened',
    event: onAppHomeOpened,
  },
  {
    name: 'onOpenModalEnterCode',
    action: onOpenModalEnterCode
  },
  {
    name: 'onSubmitGithubCode',
    view: onSubmitGithubCode
  },
  {
    name: '/ufjt',
    command: onUFJTCommand
  }
];

// @ts-ignore
export const githubListeners: GithubListeners = [
  {
    name: 'pull_request.ready_for_review',
    handler: readyForReview
  },
  {
    name: 'pull_request.edited',
    handler: edited
  },
  {
    name: 'pull_request.opened',
    handler: opened
  },
  {
    name: 'pull_request.closed',
    handler: closed
  },
  {
    name: 'pull_request.review_requested',
    handler: requestReview
  },
  {
    name: 'pull_request.reopened',
    handler: readyForReview
  },
  {
    name: ['pull_request_review_comment'],
    handler: commented
  },
  {
    name: 'pull_request.synchronize',
    handler: sync
  },
  {
    name: 'pull_request_review.submitted',
    handler: reviewSubmitted
  }
];