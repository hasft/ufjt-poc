import onAppHomeOpened from './slack/events/onAppHomeOpened.js';
import onOpenModalEnterCode from './slack/actions/onOpenModalEnterCode.js';
import onSubmitGithubCode from './slack/views/onSubmitGithubCode.js';
import onUFJTCommand from './slack/commands/onUFJTCommand.js';
import readyForReview from './github/pullRequest/readyForReview.js';
import opened from './github/pullRequest/opened.js';
import edited from './github/pullRequest/edited.js';
import reviewComment from './github/pullRequest/reviewComment.js';
import closed from './github/pullRequest/closed.js';
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
    name: 'pull_request_review_comment',
    handler: reviewComment
  },
  {
    name: 'pull_request.closed',
    handler: closed
  },
  {
    name: 'pull_request.reopened',
    handler: readyForReview
  }
];