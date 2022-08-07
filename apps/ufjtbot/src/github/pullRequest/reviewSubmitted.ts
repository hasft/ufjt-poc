import { Context } from 'probot';
import { useSlackClient } from '../../utils.js';
import reviewSubmittedMessage from '../../slack/blocks/reviewSubmittedMessage.js';
import { getChannelsFromRepository, getPullRequestMessages } from '../../requests.js';

export default async function reviewSubmitted({ payload }: Context<'pull_request_review.submitted'>) {
  const { app, token } = useSlackClient();
  const { repository, pull_request, review } = payload;
  const channels = await getChannelsFromRepository(`${repository.owner.login}/${repository.name}`);
  const { state, user, submitted_at, body, html_url } = review;

  if (!channels?.length) {
    return;
  }

  const pullRequestMessages = await getPullRequestMessages(channels, pull_request.id);

  if (!pullRequestMessages) {
    return;
  }

  await Promise.all(pullRequestMessages.map(async ({ channel, ts }) => {
    await app.client.chat.postMessage({
      text: '🌈 Review Submitted',
      blocks: reviewSubmittedMessage({
        user: user.login,
        state,
        time: submitted_at,
        comment: body,
        url: html_url
      }),
      thread_ts: ts,
      channel,
      token
    });
  }));
}