import { MergedMessageArguments } from "../../types";

export default function mergedMessage({ user, url, title }: MergedMessageArguments) {
  return [
    {
      'type': 'context',
      'elements': [
        {
          'type': 'mrkdwn',
          'text': `*Merged*: @${user} has merged ~<${url}|${title}>~.`
        }
      ]
    }
  ];
}