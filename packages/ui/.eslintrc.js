module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8
  },
  env: {
    browser: true
  },
  extends: ['standard', 'airbnb-base', 'plugin:vue/recommended'],
  plugins: ['html', 'pug'],
  rules: {
    'linebreak-style': 0,
    'arrow-parens': ['error', 'as-needed'],
    'no-undefined': 'error',
    'object-curly-spacing': ['error', 'always'],
    'generator-star-spacing': 0,
    semi: ['error', 'always'],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-tabs': 0,
    indent: 0,
    'space-before-blocks': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'comma-dangle': ['error', 'only-multiline'],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state', 'Vue', 'event']
      }
    ]
  }
};
