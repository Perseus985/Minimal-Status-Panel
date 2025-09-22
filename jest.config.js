const standard = require('@grafana/toolkit/src/config/jest.plugin.config');

module.exports = {
  ...standard.jestConfig(),
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
};
