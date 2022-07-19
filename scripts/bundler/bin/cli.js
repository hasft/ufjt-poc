import yargs from 'yargs';
import process from 'process';
import { command } from './commands/bundle.js';
// eslint-disable-next-line complexity,max-statements
export async function cli(args) {
    const parser = yargs(args.slice(2)).options({
        ships: {
            type: 'boolean',
            default: false
        }
    });
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const argv = await parser.argv;
    const cmd = argv._[0];
    // eslint-disable-next-line no-undefined
    const target = argv._[1] || undefined;
    const options = {
        minify: Boolean(argv.minify) || true,
        bundle: Boolean(argv.bundle) || false,
        module: argv.module || 'esm'
    };
    if (cmd === 'build') {
        process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    }
    if (cmd === 'bundle') {
        await command(options, target);
        return;
    }
    process.exit(1);
}
