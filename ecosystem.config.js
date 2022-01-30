module.exports = {
  apps: [
    {
      name: 'server',
      script: 'yarn --cwd ./server install && yarn --cwd ./server start',
    },
    {
      name: 'client',
      script: 'yarn --cwd ./client install && yarn --cwd ./client start',
    },
  ],
};
