import dotenv from 'dotenv';

dotenv.config(); // Load biến môi trường từ file .env

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import typescript from '@rollup/plugin-typescript';
import esbuild from 'rollup-plugin-esbuild';
import replace from '@rollup/plugin-replace';

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
        replace({
            preventAssignment: true, // Cần thiết cho Rollup 3+
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
            'process.env.API_URL': JSON.stringify(process.env.API_URL || ''),
            'process.env.SOCKET_URL': JSON.stringify(process.env.SOCKET_URL || ''),
        }),
    ],

    treeshake: false,

    external: [
        'playwright', // 👈 cực quan trọng nếu bạn dùng Playwright
    ],
};
