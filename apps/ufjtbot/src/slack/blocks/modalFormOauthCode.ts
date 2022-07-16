export default function modalFormOauthCode() {
  return [
    {
      type: 'input',
      block_id: 'input_oauth_code',
      label: {
        type: 'plain_text',
        text: 'Verification code'
      },
      element: {
        type: 'plain_text_input',
        action_id: 'send_oauth_code',
      }
    },
    {
      block_id: 'channel-select',
      type: 'input',
      optional: true,
      label: {
        type: 'plain_text',
        text: 'Select a channel to post the result on',
      },
      element: {
        default_to_current_conversation: true,
        action_id: 'channel-select-id',
        type: 'conversations_select',
        response_url_enabled: true,
      },
    },
  ];
}