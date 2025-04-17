// .eslintrc.js
module.exports = {
    root: true,
    env: {
      node: true,
      browser: true,
      es6: true,
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@babel/eslint-parser',
      ecmaVersion: 2020,
      sourceType: 'module',
      requireConfigFile: false,
      babelOptions: {
        presets: ['@babel/preset-env'],
      },
    },
    extends: [
      'plugin:vue/vue3-recommended',
      'eslint:recommended',
    ],
    plugins: [
      'vue',
    ],
    rules: {
      // 添加或覆盖自定义规则
      'no-unused-vars': 'warn',
      'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
      // 其他规则...
    },
  }