import { MergedMessageArguments } from "../../types";

export default function mergedMessage({ user, url, title, branch, state }: MergedMessageArguments) {
  return [
    {
      'type': 'context',
      'elements': [
        {
          'type': 'mrkdwn',
          'text': `@${user} has ${state} ~<${url}|${title}>~ ${state === 'merged' ? `to ${branch}` : ''}`
        }
      ]
    }
  ];
}