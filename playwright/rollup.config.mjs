import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import typescript from '@rollup/plugin-typescript';
import esbuild from 'rollup-plugin-esbuild';

export default {
    input: 'src/index.ts',

    output: {
        file: 'dist/app.js', // 👈 1 FILE DUY NHẤT
        format: 'cjs', // Node dùng cjs cho ổn định
        sourcemap: false,
        inlineDynamicImports: true,
    },

    plugins: [
        resolve({
            extensions: ['.js', '.ts'], // 👈 BẮT BUỘC
            preferBuiltins: true, // ưu tiên module Node
        }),
        commonjs(),
        // typescript(),
        esbuild(),
    ],

    treeshake: false,

    external: [
        'playwright', // 👈 cực quan trọng nếu bạn dùng Playwright
    ],
};
