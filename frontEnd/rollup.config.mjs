import dotenv from 'dotenv';

dotenv.config(); // Load biến môi trường từ file .env

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import alias from '@rollup/plugin-alias';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import os from 'os';
import postcss from 'rollup-plugin-postcss';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import url from '@rollup/plugin-url';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const getLocalIp = () => {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        for (const net of interfaces[name] || []) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
};

const PORT = 3000;
const HOST = getLocalIp();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const entries = [
    { find: '@src', replacement: path.resolve(__dirname, 'src') },
    { find: '@src', replacement: 'src' },
    { find: 'stream', replacement: 'stream-browserify' },
];
const customResolver = resolve({
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.pcss', '.scss', '.png'],
});

const rollup_dev = isDev && [
    {
        input: 'src/index.tsx',
        output: [
            // {
            //     file: 'dist/index.cjs',
            //     format: 'cjs',
            //     sourcemap: isDev,
            // },
            {
                file: 'dist/index.js',
                format: 'es',
                sourcemap: false,
            },
            {
                file: 'dist/index.mjs',
                format: 'es',
                sourcemap: true,
            },
        ],
        plugins: [
            // polyfillNode(),
            resolve({
                browser: true, // Quan trọng: để build cho browser
                preferBuiltins: false,
            }),
            // nodePolyfills(),
            peerDepsExternal(),
            external(),
            // resolve(),
            commonjs(),
            postcss({
                plugins: [postcssPresetEnv(), autoprefixer()],
                minimize: false, // Nén CSS
                modules: true, // Hỗ trợ CSS Modules
                extract: true, // Xuất CSS ra file riêng,
                use: {
                    sass: true, // Kích hoạt hỗ trợ SCSS
                },
                sourceMap: true,
            }),
            typescript({
                tsconfig: './tsconfig.json',
                // declarationDir: 'dist/types',
                // sourcemap: true
            }),
            babel({
                babelHelpers: 'bundled',
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.pcss', '.scss'],
                exclude: ['node_modules/**', '**/*.test.tsx', '**/*.spec.ts'],
                sourceMaps: true,
            }),
            alias({
                entries: entries,
                customResolver,
            }),
            serve({
                open: true, // Tự động mở trình duyệt
                contentBase: 'dist', // Thư mục chứa file được phục vụ
                host: HOST,
                port: PORT, // Cổng chạy server
                historyApiFallback: true, // Đảm bảo rằng yêu cầu không phải là tài nguyên tĩnh sẽ trả về index.html
            }),
            livereload('dist'), // Theo dõi thư mục "dist" và reload khi có thay đổi
            copy({
                targets: [{ src: 'public/index.html', dest: 'dist' }],
            }),
            json(),
            replace({
                preventAssignment: true, // Cần thiết cho Rollup 3+
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
                'process.env.API_URL': JSON.stringify(process.env.API_URL || ''),
            }),
            // html({
            //     fileName: 'index.html',
            // }),
            url({
                include: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.gif'],
                limit: 0, // Đặt 0 để luôn xuất file, không chuyển thành base64
                fileName: '[name]-[hash][extname]', // Định dạng tên file đầu ra
            }),
        ],
        resolve: {
            alias: {
                stream: 'stream-browserify',
            },
        },
        // external: ['react', 'react-dom'], // chỉ dùng khi build thư viện
        treeshake: {
            pureExternalModules: true, // Xử lý các module ngoài có annotation __PURE__
            annotations: false, // Bật tính năng nhận diện annotation
        },
        external: ['jest'],
    },
];

const rollup_prod = isProd && [
    {
        input: 'src/index.tsx',
        output: [
            {
                file: 'dist/index.js',
                format: 'es',
                sourcemap: false,
            },
            {
                file: 'dist/index.mjs',
                format: 'es',
                sourcemap: false,
            },
        ],
        plugins: [
            replace({
                preventAssignment: true, // Cần thiết cho Rollup 3+
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
                'process.env.API_URL': JSON.stringify(process.env.API_URL || ''),
                'process.env.SOCKET_URL': JSON.stringify(process.env.SOCKET_URL || ''),
            }),
            resolve({
                browser: true, // Quan trọng: để build cho browser
                preferBuiltins: false,
            }),
            peerDepsExternal(),
            external(),
            // resolve(),
            commonjs(),
            postcss({
                plugins: [postcssPresetEnv(), autoprefixer()],
                minimize: true, // Nén CSS
                modules: true, // Hỗ trợ CSS Modules
                extract: true, // Xuất CSS ra file riêng,
                use: {
                    sass: true,
                },
            }),
            typescript({
                tsconfig: './tsconfig.json',
                // declarationDir: 'dist/types',
            }),
            babel({
                babelHelpers: 'bundled',
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.pcss', '.scss'],
                exclude: ['node_modules/**', '**/*.test.tsx', '**/*.spec.ts'],
            }),
            alias({
                entries: entries,
                customResolver,
            }),
            copy({
                targets: [{ src: 'public/index.html', dest: 'dist' }],
            }),
            json(),
            // html({
            //     fileName: 'index.html',
            // }),
            url({
                include: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.gif'],
                limit: 0, // Đặt 0 để luôn xuất file, không chuyển thành base64
                fileName: '[name]-[hash][extname]', // Định dạng tên file đầu ra
            }),
            terser(), // Chỉ nén code khi ở production
        ],
        // external: ['react', 'react-dom'], // chỉ dùng khi build thư viện
        treeshake: {
            pureExternalModules: true, // Xử lý các module ngoài có annotation __PURE__
            annotations: true, // Bật tính năng nhận diện annotation
        },
        external: ['jest'],
    },
];

let rollup_final;

switch (process.env.NODE_ENV) {
    case 'development':
        setTimeout(() => {
            console.log(`🚀 (rollup) Dev server running at: http://${HOST}:${PORT}`);
            console.log(process.env.NODE_ENV !== 'production', process.env.NODE_ENV);
        }, [5000]);
        rollup_final = rollup_dev;
        break;
    case 'production':
        console.log('..........🚀 (rollup) You are building production !');
        rollup_final = rollup_prod;
        setTimeout(() => {
            console.log(
                '🚀 Rollup Plugins in Production:',
                rollup_prod[0].plugins.map((p) => p.name)
            );
            // exec('tasklist | findstr node', (err, stdout, stderr) => {
            //     if (err) {
            //         console.error(`Error: ${err.message}`);
            //         return;
            //     }
            //     if (stderr) {
            //         console.error(`Stderr: ${stderr}`);
            //         return;
            //     }
            //     console.log('🔥 Các tiến trình Node.js đang chạy:');
            //     console.log(stdout, stderr, `🚀 Rollup đang chạy với PID: ${process.pid}`);
            // });
        }, 5000);
        break;
    default:
        setTimeout(() => {
            console.log(`............You are running mod (${process.env.NODE_ENV}). This mod is NOT set-up !`);
        }, 5000);
}

export default rollup_final;
