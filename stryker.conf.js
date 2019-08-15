module.exports = function (config) {
    config.set({
        mutator: {
            name: 'javascript',
            excludedMutations: [
                'StringLiteral',
                'ObjectLiteral'
            ]
        },
        packageManager: 'yarn',
        reporters: [
            'html',
            'clear-text',
            'progress'
        ],
        testRunner: 'jest',
        transpilers: [],
        coverageAnalysis: 'all',
        mutate: [
            'src/repository/*Repository.js'
        ],
        files: [
            'src/**/*.js',
            'tests/unit/*.js'
        ]
    });
};
