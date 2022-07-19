import { rollup } from 'rollup';
import pluginResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import * as path from 'path';
import * as process from 'process';
// eslint-disable-next-line max-len
// eslint-disable-next-line consistent-return,complexity,max-statements
async function bundle(inputOptions, outputOptionsList) {
    let bundler = null;
    let buildFailed = false;
    try {
        // create a bundle
        bundler = await rollup(inputOptions);
        // an array of file names this bundle depends on
        return await generateOutputs(bundler, outputOptionsList);
    } catch (error) {
        buildFailed = true;
        // do some error reporting
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
    process.exit(buildFailed ? 1 : 0);
}
async function generateOutputs(bundler, outputOptionsList) {
    await Promise.all(outputOptionsList.map(async (outputOptions)=>{
        await bundler.write(outputOptions);
    }));
}
export async function command(options, target) {
    const currentPath = (newPath)=>path.join(process.cwd(), newPath);
    const buildFile = path.basename(target).replace(path.extname(target), '.js');
    const inputTypedOptions = {
        input: target,
        plugins: [
            dts()
        ]
    };
    const outputTypedOptions = [
        {
            file: currentPath('dist/bundle.d.ts'),
            format: options.module
        }
    ];
    const inputOptions = {
        input: currentPath(`build/${buildFile}`),
        onwarn: (warning)=>{
            if (warning.code === 'THIS_IS_UNDEFINED') {
                console.warn('undefined');
            }
        },
        plugins: [
            pluginResolve(),
            terser()
        ]
    };
    const outputOptions = [
        {
            file: currentPath('dist/bundle.js'),
            format: options.module
        }
    ];
    await bundle(inputOptions, outputOptions);
    await bundle(inputTypedOptions, outputTypedOptions);
}