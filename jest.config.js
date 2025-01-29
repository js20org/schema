module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: false,
    rootDir: './',
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    transformIgnorePatterns: ['<rootDir>/node_modules/js-build-deploy'],
    moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/src/$1'
    },
};
