import {
  AllMiddlewareArgs,
  App as Slack,
  ExpressReceiver,
  SlackActionMiddlewareArgs,
  SlackCommandMiddlewareArgs,
  SlackEventMiddlewareArgs,
  SlackViewMiddlewareArgs,
  ViewSubmitAction,
} from '@slack/bolt';
import { Context, Probot } from 'probot';
import { NextFunction, Request, Response } from 'express';

const dada = 'dada';
console.log(dada);

export interface Config {
  port: string | number;
  host: string;
  appName: string;
  command: string;
  slackRedirectOauthPath: string;
  githubRedirectOauthPath: string;
  githubWebhookPath: string;
  mode: 'dev' | 'prod' | 'test';
  logLevel: 'info' | 'error' | 'debug' | 'warn';
  dbName: string;
}

export interface SlackListener {
  name: string;
  event?: (listener: SlackEventMiddlewareArgs<'app_home_opened'> & AllMiddlewareArgs) => Promise<void>;
  action?: (listener: SlackActionMiddlewareArgs & AllMiddlewareArgs) => Promise<void>;
  command?: (listener: SlackCommandMiddlewareArgs & AllMiddlewareArgs) => Promise<void>;
  view?: (listener: SlackViewMiddlewareArgs & AllMiddlewareArgs) => Promise<void>;
}

export interface GithubListener {
  name: EmitterWebhookEventName | EmitterWebhookEventName[];
  setup?: (ctx: Context) => Promise<void>;
  handler: (ctx: Context) => Promise<void>;
}

export type GithubListeners = GithubListener[];
export type SlackListeners = SlackListener[];
export declare const emitterEventNames: readonly ['branch_protection_rule', 'branch_protection_rule.created', 'branch_protection_rule.deleted', 'branch_protection_rule.edited', 'check_run', 'check_run.completed', 'check_run.created', 'check_run.requested_action', 'check_run.rerequested', 'check_suite', 'check_suite.completed', 'check_suite.requested', 'check_suite.rerequested', 'code_scanning_alert', 'code_scanning_alert.appeared_in_branch', 'code_scanning_alert.closed_by_user', 'code_scanning_alert.created', 'code_scanning_alert.fixed', 'code_scanning_alert.reopened', 'code_scanning_alert.reopened_by_user', 'commit_comment', 'commit_comment.created', 'create', 'delete', 'deploy_key', 'deploy_key.created', 'deploy_key.deleted', 'deployment', 'deployment.created', 'deployment_status', 'deployment_status.created', 'discussion', 'discussion.answered', 'discussion.category_changed', 'discussion.created', 'discussion.deleted', 'discussion.edited', 'discussion.labeled', 'discussion.locked', 'discussion.pinned', 'discussion.transferred', 'discussion.unanswered', 'discussion.unlabeled', 'discussion.unlocked', 'discussion.unpinned', 'discussion_comment', 'discussion_comment.created', 'discussion_comment.deleted', 'discussion_comment.edited', 'fork', 'github_app_authorization', 'github_app_authorization.revoked', 'gollum', 'installation', 'installation.created', 'installation.deleted', 'installation.new_permissions_accepted', 'installation.suspend', 'installation.unsuspend', 'installation_repositories', 'installation_repositories.added', 'installation_repositories.removed', 'issue_comment', 'issue_comment.created', 'issue_comment.deleted', 'issue_comment.edited', 'issues', 'issues.assigned', 'issues.closed', 'issues.deleted', 'issues.demilestoned', 'issues.edited', 'issues.labeled', 'issues.locked', 'issues.milestoned', 'issues.opened', 'issues.pinned', 'issues.reopened', 'issues.transferred', 'issues.unassigned', 'issues.unlabeled', 'issues.unlocked', 'issues.unpinned', 'label', 'label.created', 'label.deleted', 'label.edited', 'marketplace_purchase', 'marketplace_purchase.cancelled', 'marketplace_purchase.changed', 'marketplace_purchase.pending_change', 'marketplace_purchase.pending_change_cancelled', 'marketplace_purchase.purchased', 'member', 'member.added', 'member.edited', 'member.removed', 'membership', 'membership.added', 'membership.removed', 'meta', 'meta.deleted', 'milestone', 'milestone.closed', 'milestone.created', 'milestone.deleted', 'milestone.edited', 'milestone.opened', 'org_block', 'org_block.blocked', 'org_block.unblocked', 'organization', 'organization.deleted', 'organization.member_added', 'organization.member_invited', 'organization.member_removed', 'organization.renamed', 'package', 'package.published', 'package.updated', 'page_build', 'ping', 'project', 'project.closed', 'project.created', 'project.deleted', 'project.edited', 'project.reopened', 'project_card', 'project_card.converted', 'project_card.created', 'project_card.deleted', 'project_card.edited', 'project_card.moved', 'project_column', 'project_column.created', 'project_column.deleted', 'project_column.edited', 'project_column.moved', 'projects_v2_item', 'projects_v2_item.archived', 'projects_v2_item.converted', 'projects_v2_item.created', 'projects_v2_item.deleted', 'projects_v2_item.edited', 'projects_v2_item.reordered', 'projects_v2_item.restored', 'public', 'pull_request', 'pull_request.assigned', 'pull_request.auto_merge_disabled', 'pull_request.auto_merge_enabled', 'pull_request.closed', 'pull_request.converted_to_draft', 'pull_request.edited', 'pull_request.labeled', 'pull_request.locked', 'pull_request.opened', 'pull_request.ready_for_review', 'pull_request.reopened', 'pull_request.review_request_removed', 'pull_request.review_requested', 'pull_request.synchronize', 'pull_request.unassigned', 'pull_request.unlabeled', 'pull_request.unlocked', 'pull_request_review', 'pull_request_review.dismissed', 'pull_request_review.edited', 'pull_request_review.submitted', 'pull_request_review_comment', 'pull_request_review_comment.created', 'pull_request_review_comment.deleted', 'pull_request_review_comment.edited', 'pull_request_review_thread', 'pull_request_review_thread.resolved', 'pull_request_review_thread.unresolved', 'push', 'release', 'release.created', 'release.deleted', 'release.edited', 'release.prereleased', 'release.published', 'release.released', 'release.unpublished', 'repository', 'repository.archived', 'repository.created', 'repository.deleted', 'repository.edited', 'repository.privatized', 'repository.publicized', 'repository.renamed', 'repository.transferred', 'repository.unarchived', 'repository_dispatch', 'repository_import', 'repository_vulnerability_alert', 'repository_vulnerability_alert.create', 'repository_vulnerability_alert.dismiss', 'repository_vulnerability_alert.reopen', 'repository_vulnerability_alert.resolve', 'secret_scanning_alert', 'secret_scanning_alert.created', 'secret_scanning_alert.reopened', 'secret_scanning_alert.resolved', 'security_advisory', 'security_advisory.performed', 'security_advisory.published', 'security_advisory.updated', 'security_advisory.withdrawn', 'sponsorship', 'sponsorship.cancelled', 'sponsorship.created', 'sponsorship.edited', 'sponsorship.pending_cancellation', 'sponsorship.pending_tier_change', 'sponsorship.tier_changed', 'star', 'star.created', 'star.deleted', 'status', 'team', 'team.added_to_repository', 'team.created', 'team.deleted', 'team.edited', 'team.removed_from_repository', 'team_add', 'watch', 'watch.started', 'workflow_dispatch', 'workflow_job', 'workflow_job.completed', 'workflow_job.in_progress', 'workflow_job.queued', 'workflow_run', 'workflow_run.completed', 'workflow_run.requested'];
export declare type EmitterWebhookEventName = typeof emitterEventNames[number];

export interface UseSlackClient {
  app: Slack,
  receiver: ExpressReceiver;
  client: Slack['client'];
  token: string;
}

export interface UseGithubClient {
  app: Probot
}

export type AppHomeOpenedEventArgs = SlackEventMiddlewareArgs<'app_home_opened'> & AllMiddlewareArgs;

export interface ServerRoute {
  handler: (req: Request, res: Response, next: NextFunction) => void;
}

export type ServerRoutes = Record<string, ServerRoute>;

export type GetUserArgs = ViewSubmitAction['user'];

export interface UfjtUser {
  gId: number;
  gName: string;
  gUrl: string;
  sId: string;
  tId: string;
  sName: string;
}

export interface ConnectedMessageArgs {
  gName: string;
  sName: string;
  gUrl: string;
  command: string;
}

export interface Subscriber {
  repoFullName: string;
  channelId: string;
  teamId: string;
  installationId: string;
  reviewers?: string[]
}

export interface MatchedGroups {
  action?: string;
  owner?: string;
  repo?: string;
  reviewers?: string;
}

export interface Conversation {
  ts: string;
  channel: string;
  pull_request: number;
}

export interface ReadyForReviewMessageArguments {
  title: string;
  htmlUrl: string;
  number: number;
  author: string;
  commits: number;
  targetBranch: string;
  targetBranchUrl: string;
  originBranch: string;
  originBranchUrl: string;
  time: string;
  fileChangedSize: number;
  status: string;
  files: string[];
  labels: string[];
  reviewers: string[];
  jiraName: string;
  jiraLink: string;
}

export interface PleaseInstallMessageArguments {
  owner: string;
  repo: string;
  channel: string;
  teamId: string;
  reviewers?: string;
}

export interface MergedMessageArguments {
  user: string;
  title: string;
  state: string;
  url: string;
  branch: string;
  number: number;
}

export interface Chat {
  channel: string,
  ts: string,
}

export interface ReviewSubmittedMessageArguments {
  user: string;
  state: string;
  time: string;
  comment: string | null;
  url: string;
}