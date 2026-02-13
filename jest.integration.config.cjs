module.exports = {
  rootDir: __dirname,
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.a11y.ts',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: '22' } }],
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

