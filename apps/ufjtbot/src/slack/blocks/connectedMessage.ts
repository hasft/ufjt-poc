import { ConnectedMessageArgs } from '../../types';

export default function connectedMessage({
  sName,
  gUrl,
  gName,
  command
}: ConnectedMessageArgs) {
  return [
    {
      'type': 'section',
      'text': {
        'type': 'mrkdwn',
        // eslint-disable-next-line max-len
        'text': `Hey 👋 <@${sName}> Now you are connected to *<${gUrl}|@${gName}>*.`
      }
    },
    {
      'type': 'divider'
    },
    {
      'type': 'section',
      'text': {
        'type': 'mrkdwn',
        'text': `*Use the \`${command}\` command*.`
      }
    },
    {
      'type': 'section',
      'fields': [
        {
          'type': 'mrkdwn',
          'text': 'Subscribe'
        },
        {
          'type': 'mrkdwn',
          'text': `*\`${command} subscribe owner/repo\`*`
        },
        {
          'type': 'mrkdwn',
          'text': 'Unsubscribe'
        },
        {
          'type': 'mrkdwn',
          'text': `*\`${command} unsubscribe owner/repo\`*`
        },
      ]
    },
    {
      'type': 'divider'
    },
    {
      'type': 'context',
      'elements': [
        {
          'type': 'mrkdwn',
          'text': `👀 View all subscribed with \`${command} list\`\n❓Get help` +
            `at any time with \`${command} help\` or type *help* in a DM with me`
        }
      ]
    }
  ];
}