#!/usr/bin/env node
import yargs from 'yargs-parser';
import dockerized from "./dockerized.mjs";

const cli = async (args) => {
  const cliFlags = yargs(args, {
    array: ['exclude'],
    boolean: ['onlyList']
  });
  const cmd = cliFlags['_'][2];
  if (!cmd) {
    process.exit(1);
  }

  if (cmd === 'dockerized') {
    const target = cliFlags['_'][3];
    const { _, ...rest } = cliFlags;
    await dockerized(target, rest);
    return process.exit(0);
  }
}

cli(process.argv)
.then(res => {
  console.log('SUCCESS');
})
.catch(err => {
  console.error(err);
})