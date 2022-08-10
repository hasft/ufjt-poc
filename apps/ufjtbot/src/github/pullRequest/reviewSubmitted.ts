import { Context } from 'probot';
import { useSlackClient } from '../../utils.js';
import reviewSubmittedMessage from '../../slack/blocks/reviewSubmittedMessage.js';
import {
  getChannelsFromRepository,
  getPullRequestMessages,
  getSlackUserName,
  insertChildToConversation
} from '../../requests.js';

export default async function reviewSubmitted({ payload }: Context<'pull_request_review.submitted'>) {
  const { app, token } = useSlackClient();
  const { repository, pull_request, review } = payload;
  const channels = await getChannelsFromRepository(`${repository.owner.login}/${repository.name}`);
  const { state, user, submitted_at, body, html_url } = review;
  const ufjtUser = await getSlackUserName(user.id);

  if (!channels?.length || state === 'commented') {
    return;
  }

  const pullRequestMessages = await getPullRequestMessages(channels, pull_request.id);

  if (!pullRequestMessages) {
    return;
  }

  await Promise.all(pullRequestMessages.map(async ({ channel, ts }) => {
    const { ts: childTs } = await app.client.chat.postMessage({
      text: '🌈 Review Submitted',
      blocks: reviewSubmittedMessage({
        user: ufjtUser || user.login,
        state,
        time: submitted_at,
        comment: body,
        url: html_url
      }),
      thread_ts: ts,
      channel,
      token
    });
    await insertChildToConversation({ channel, ts }, childTs as string);
  }));
}