console.log('Loading Stylelint config...');

export default {
    extends: ['stylelint-config-standard', 'stylelint-config-recommended', 'stylelint-scss'],
    defaultSeverity: 'warning', // Cảnh báo khi không có file CSS
    reportNeedlessDisables: false, // Ngăn Stylelint báo lỗi không cần thiết
    allowEmptyInput: true, // Không lỗi khi không có file CSS
    ignoreFiles: ['dist/index.css'],
    overrides: [
        {
            files: ['src/**/*.css', 'src/**/*.pcss', 'src/**/*.scss'],
            customSyntax: 'postcss-syntax',
        },
    ],
    rules: {
        // indentation: 2,
        // 'string-quotes': 'double',
        'color-hex-length': 'short',
        'no-empty-source': [true, { severity: 'warning' }],
    },
};
