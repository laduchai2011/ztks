// postcss.config.mjs
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';

console.log('Loading Postcss config...');

export default {
    plugins: [
        postcssPresetEnv({
            stage: 1, // Chọn stage phù hợp với bạn
            features: {
                'nesting-rules': true, // Kích hoạt nesting
            },
        }),
        autoprefixer(),
    ],
};
