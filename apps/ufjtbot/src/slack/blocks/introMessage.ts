export default function introMessage(channel: string, botName: string) {
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Welcome to the ${botName} :wave:  \n` +
          'To get started you have to sign into your GitHub account.'
      }
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Connect ke Github'
          },
          url: `https://github.com/login/oauth/authorize?client_id=${githubClientId}&state=${channel}`,
          style: 'primary'
        }
      ]
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Complete sign-in by entering the verification code presented to you post authentication.'
      }
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Enter code'
          },
          action_id: 'onOpenModalEnterCode'
        }
      ]
    }
  ];
}