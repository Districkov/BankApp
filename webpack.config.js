const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const fs = require('fs');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // HTTPS configuration
  config.devServer = {
    ...config.devServer,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'dev.bank.korzik.space+2-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'dev.bank.korzik.space+2.pem')),
    },
    host: 'dev.bank.korzik.space',
    port: 8443,
    allowedHosts: ['dev.bank.korzik.space', 'localhost'],
  };

  return config;
};
