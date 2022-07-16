import { PleaseInstallMessageArguments } from "../../types";

export default function pleaseInstallMessage({ owner, repo, channel, teamId, reviewers }: PleaseInstallMessageArguments) {
  const state = !reviewers ? `${owner}/${repo}--${channel}--${teamId}` : `${owner}/${repo}--${channel}--${teamId}--${reviewers}`;

  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Either the app isn\'t installed on your repository or the repository does not exist. Install it to proceed.\n' +
          '_Note: You will need to ask the owner of the repository to install it for you._'
      }
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Install App on Github'
          },
          url: `https://github.com/apps/uf-probolt/installations/new?state=${state}`,
          style: 'primary'
        }
      ]
    },
  ];
}