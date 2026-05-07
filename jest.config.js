module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  collectCoverageFrom: [
    'routes/**/*.js',
    'server.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/'
  ]
};
