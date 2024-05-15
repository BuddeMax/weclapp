module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios).+\\.js$',
  ],
  automock: false,
  resetMocks: false,
  testMatch: [
    '**/tests/unit/**/*.spec.[jt]s?(x)',
    '**/tests/unit/**/*.test.[jt]s?(x)',
    '**/__tests__/*.[jt]s?(x)',
  ]
};





