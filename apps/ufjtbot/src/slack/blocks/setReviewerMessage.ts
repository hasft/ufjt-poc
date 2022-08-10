import { SetReviewerMessageArguments } from "../../types";

export default function setReviewerMessage({ channel }: SetReviewerMessageArguments) {
  return [
    {
      'type': 'section',
      'text': {
        'type': 'mrkdwn',
        'text': '*Always mention* this user on `ready_for_review` pull requests'
      }
    },
    {
      'type': 'input',
      'block_id': 'input_repository',
      'element': {
        'type': 'plain_text_input',
        'action_id': 'set_repository_name',
        'placeholder': {
          'type': 'plain_text',
          'text': 'owner/repo'
        }
      },
      'label': {
        'type': 'plain_text',
        'text': 'Repository',
        'emoji': true
      }
    },
    {
      'block_id': 'mention_channel_select',
      'type': 'input',
      'optional': true,
      'label': {
        'type': 'plain_text',
        'text': 'Select a channel to post the result on',
      },
      'element': {
        'action_id': 'channel_select_id',
        'type': 'channels_select',
        'initial_channel': channel,
        'response_url_enabled': true,
      },
    },
    {
      'type': 'input',
      'block_id': 'select_reviewer',
      'element': {
        'type': 'multi_users_select',
        'placeholder': {
          'type': 'plain_text',
          'text': 'Select users',
          'emoji': true
        },
        'action_id': 'set_reviewer'
      },
      'label': {
        'type': 'plain_text',
        'text': '⛸ - reviewers',
        'emoji': true
      }
    }
  ];
}