import { ReviewSubmittedMessageArguments } from '../../types';

const reviewSubmittedCommented = (comment: string ) => {
  return {
    "type": "context",
    "elements": [
      {
        "type": "mrkdwn",
        "text": comment
      }
    ]
  }
}

export default function reviewSubmittedMessage(arg: ReviewSubmittedMessageArguments) {
  const { user, state, time, comment, url } = arg;
  const convertedTime = Math.floor(new Date(time).getTime() / 1000);

  const blocks = [
    {
      'type': 'context',
      'elements': [
        {
          'type': 'mrkdwn',
          'text': `${user} has ${state} on \`<!date^${convertedTime}^{time_secs}|6:39 AM PST>\`\n<${url}|${url}>`
        }
      ]
    }
  ];

  switch (state) {
    case 'commented':
      return [...blocks, reviewSubmittedCommented(comment || '-')]
    case 'approved':
      return blocks;
    default:
      return blocks;
  }
}