module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.jest.spec.ts'],
  moduleFileExtensions: ['ts', 'js'],
  transform: { '^.+\\.ts$': ['ts-jest', { tsconfig: { strict: false } }] },
};
