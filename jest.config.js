/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  roots: ['./src/test'],
  moduleDirectories: ['node_modules', './src'],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};