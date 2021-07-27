module.exports = {
  'extends': 'eslint:recommended',
  'env': {
    'node': true,
    'es2021': true,
    'jest/globals': true
  },
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'no-cond-assign': 'off',
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ]
  },
  plugins: ['jest']
}
