import dts from 'rollup-plugin-dts'
import typescript from '@rollup/plugin-typescript';
import autoExternal from 'rollup-plugin-auto-external';

const config = [
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.js',
            format: 'cjs'
        },
        plugins: [typescript(), autoExternal()]
    },
    {
        input: 'dist/index.d.ts',
        output: {
            file: 'dist/index.d.ts',
            format: 'cjs'
        },
        plugins: [dts()],
    }
]

export default config
