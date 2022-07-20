import { MergedMessageArguments } from "../../types";

export default function mergedMessage({ user, url, title, branch, state }: MergedMessageArguments) {
  return [
    {
      'type': 'context',
      'elements': [
        {
          'type': 'mrkdwn',
          'text': `*Merged*: @${user} has ${state} ~<${url}|${title}>~ to ${branch}`
        }
      ]
    }
  ];
}