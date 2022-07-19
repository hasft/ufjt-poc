import { rollup } from 'rollup';
import pluginResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
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
// eslint-disable-next-line max-len
// eslint-disable-next-line max-lines-per-function,max-statements,complexity
export async function command(options, target) {
    if (!target) {
        return;
    }
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
            file: currentPath(`${options.outdir}/bundle.d.ts`),
            format: options.module
        }
    ];
    const inputOptions = {
        input: currentPath(`build/${buildFile}`),
        onwarn: (warning)=>{
            if (warning.code === 'THIS_IS_UNDEFINED') {
                console.warn(warning.message);
            }
        },
        plugins: [
            pluginResolve(),
            json(),
            terser()
        ],
        external: []
    };
    if (options.excludeNodeModules) {
        inputOptions.external = [
            /node_modules/
        ];
    }
    if (options.module === 'cjs') {
        inputOptions.plugins?.push(commonjs());
        if (Array.isArray(inputOptions.external)) {
            inputOptions.external.push('http', 'path');
        }
    }
    const outputOptions = [
        {
            file: currentPath(`${options.outdir}/bundle.${options.module === 'cjs' ? 'cjs' : 'js'}`),
            format: options.module
        }
    ];
    await bundle(inputOptions, outputOptions);
    if (options.module === 'cjs') {
        return;
    }
    await bundle(inputTypedOptions, outputTypedOptions);
}
