import yaml from 'js-yaml';
import * as fs from 'fs';
import path from 'path';

try {
  const config = fs.readFileSync(path.join(process.cwd(), 'config.json'), 'utf8');
  const jsonConfig = JSON.parse(config);
  const name = jsonConfig.appName;
  const host = jsonConfig.host;
  const command = `/${name}`;

  const fileContents = fs.readFileSync(path.join(process.cwd(), 'manifest.yml'), 'utf8');
  const data = yaml.load(fileContents);
  data.display_information.name = name;
  data.features.bot_user.display_name = name;
  data.features.slash_commands = data.features.slash_commands.map(item => ({
    ...item,
    url: `${host}/slack/events`,
    command: command
  }));
  data.settings.event_subscriptions.request_url = `${host}/slack/events`;
  data.settings.interactivity.request_url = `${host}/slack/events`;

  const yamlStr = yaml.dump(data);
  fs.writeFileSync(path.join(process.cwd(), 'manifest.yml'), yamlStr, 'utf8');
} catch (err) {
  console.log(err);
}