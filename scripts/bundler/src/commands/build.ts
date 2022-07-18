import { Options } from '../cli';
import { InputOptions, OutputOptions, rollup, RollupBuild } from 'rollup';
import pluginResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import * as path from 'path';
import * as process from 'process';

// eslint-disable-next-line max-len
// eslint-disable-next-line consistent-return,complexity,max-statements
async function build(inputOptions: InputOptions, outputOptionsList: OutputOptions[]) {
  let bundle: RollupBuild | null = null;
  let buildFailed = false;
  try {
    // create a bundle
    bundle = await rollup(inputOptions);

    // an array of file names this bundle depends on
    return await generateOutputs(bundle, outputOptionsList);
  } catch (error) {
    buildFailed = true;

    // do some error reporting
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  if (bundle) {
    // closes the bundle
    await bundle.close();
  }

  process.exit(buildFailed ? 1 : 0);
}

async function generateOutputs(bundle: RollupBuild, outputOptionsList: OutputOptions[]) {
  for (const outputOptions of outputOptionsList) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await bundle.write(outputOptions);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }
}

export async function command(options: Options, target?: string) {
  const currentPath = (newPath: string) => path.join(process.cwd(), newPath);

  const inputTypedOptions: InputOptions = {
    input: currentPath('build/main.js'),
    plugins: [pluginResolve(), dts()]
  };

  const outputTypedOptions = [
    {
      file: currentPath('dist/bundle.d.ts'),
      format: options.module
    }
  ];

  const inputOptions: InputOptions = {
    input: target,
    onwarn: (warning) => {
      if ( warning.code === 'THIS_IS_UNDEFINED' ) {
        console.warn('undefined');
      }
    },
    plugins: [pluginResolve(), terser()]
  };

  const outputOptions: OutputOptions[] = [
    {
      file: currentPath('dist/bundle.js'),
      format: options.module
    }
  ];

  await build(inputOptions, outputOptions);
  await build(inputTypedOptions, outputTypedOptions);

  console.log(options, target);
}