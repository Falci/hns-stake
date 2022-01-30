module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '~': './src',
          '@models': './src/models',
        },
      },
    ],
  ],
  ignore: ['**/*.spec.ts'],
};
