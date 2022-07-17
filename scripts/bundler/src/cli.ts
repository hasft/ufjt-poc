import yargs from 'yargs';
import process from 'process';
import { command } from './commands/build.js';

export interface Options {
  minify?: boolean;
  bundle?: boolean;
  module?: 'cjs' | 'esm'
}

export async function cli(args: string[]) {
  const parser = yargs(args.slice(2)).options({
    ships: { type: 'boolean', default: false },
  });

  // eslint-disable-next-line @typescript-eslint/await-thenable
  const argv = await parser.argv;
  const cmd = argv._[0];
  const target = argv._[1] as string || undefined;
  const options: Options = {
    minify: Boolean(argv.minify) || true,
    bundle: Boolean(argv.bundle) || false,
    module: argv.module as 'esm' | 'cjs' || 'esm'
  };

  if (cmd === 'build') {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  }

  if (cmd === 'build') {
    await command(options, target);
    return;
  }

  process.exit(1);
}
