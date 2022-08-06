import { WithId } from 'mongodb';
import { Subscriber } from '../../types';
import { Context } from 'probot';
import { getSlackUserName } from '../../requests.js';

export const getReviewer = async (
  channels: WithId<Subscriber>[] | null,
  requested_reviewers: Context<'pull_request.ready_for_review'>['payload']['pull_request']['requested_reviewers']
): Promise<Set<string> | null> => {
  if (!channels) {
    return null;
  }

  const reviewers: Set<string> = new Set<string>();
  const isChannelsHadDefaultReviewer = channels?.some(subscriber => subscriber.reviewers);

  if (isChannelsHadDefaultReviewer && !requested_reviewers.length) {
    channels.forEach(channel => channel.reviewers?.forEach(reviewer => reviewers.add(reviewer)));
  } else {
    const userReviewers = await getSlackUserName(requested_reviewers) || [];
    userReviewers.forEach(reviewer => {
      reviewers.add(reviewer);
    });
  }

  return reviewers;
};