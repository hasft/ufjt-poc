import { ReadyForReviewMessageArguments } from "../../types";

export default function readyForReviewMessage(args: ReadyForReviewMessageArguments) {
  const {
    title,
    htmlUrl,
    number,
    author,
    commits,
    targetBranchUrl,
    targetBranch,
    originBranchUrl,
    originBranch,
    time,
    fileChangedSize,
    status,
    labels,
    files,
    reviewers,
    jiraName,
    jiraLink
  } = args;

  const convertedTime = Math.floor(new Date(time).getTime() / 1000);
  const jira = jiraName && jiraLink ? `<${jiraName}|${jiraLink}>` : '-';

  return [
    {
      'type': 'section',
      'text': {
        'type': 'mrkdwn',
        'text': `Please Review: *<${htmlUrl}|${title}>* - _#${number}_`
      }
    },
    {
      'type': 'context',
      'elements': [
        {
          'type': 'mrkdwn',
          'text': `${author} wants to merge _${commits} commits_ into ` +
          `<${targetBranchUrl}|${targetBranch}> from <${originBranchUrl}|${originBranch}> \`<!date^${convertedTime}^{time_secs}|6:39 AM PST>\``
        }
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
          'text': `*File Changed* _(${fileChangedSize} files)_ | *Mergeable State* ${status}\n${files.map(file => `_${file}_`).join(' | ')}`
        }
      ]
    },
    {
      type: 'context',
      'elements': [
        {
          'type': 'mrkdwn',
          'text': `*cc*: ${reviewers.length ? reviewers.map(reviewer => `<@${reviewer}>`).join(' | ') : '-'}`
        },
        {
          'type': 'mrkdwn',
          'text': `*jira*: ${jira}`
        }
      ]
    },
    {
      'type': 'context',
      'elements': [
        {
          'type': 'mrkdwn',
          'text': `${labels.map(label => `\`${label}\``).join(' | ')}`
        }
      ]
    }
  ];
}