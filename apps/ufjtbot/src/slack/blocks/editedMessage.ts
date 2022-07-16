export default function editedMessage(msg = '-') {
  return [
    {
      'type': 'context',
      'elements': [
        {
          'type': 'mrkdwn',
          'text': `*Edited* there's an update on ${msg}`
        }
      ]
    }
  ];
}