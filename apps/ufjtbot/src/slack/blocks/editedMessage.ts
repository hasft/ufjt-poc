export default function editedMessage(msg = '-', author: string) {
  return [
    {
      'type': 'context',
      'elements': [
        {
          'type': 'mrkdwn',
          'text': `*Edited* there's an update on ${msg} by ${author}`
        }
      ]
    }
  ];
}