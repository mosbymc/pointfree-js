var path = require('path');

module.exports = function _karmaConfig(config) {
    //TODO: proxyquire, rewire
    config.set({
        basePath: '',
        browsers: ['Chrome'],
        singleRun: true,
        frameworks: ['browserify', 'mocha', 'chai', 'sinon', 'sinon-chai'],
        browserify: {
            debug: true,
            transform: [
                ['babelify']
            ]
        },
        files: ['./dev/**/*.js', './test/**/*.js'],
        preprocessors: {
            './test/testData.js': ['browserify'],
            './test/**/*.js': ['browserify'],
            './dev/**/*.js': ['browserify']
        },
        reporters: ['mocha', 'coverage', 'progress'],
        coverageReporter: {
            dir: './coverage',
            reporters: [
                { type: 'lcov', subdir: 'report-lcov' },
                { type: 'text-summary' },
                { type: 'html', subdir: 'report-html' }
            ]
        },
        proxies: { '/': 'http://localhost:8881/' },
        port: 9876,
        colors: true
    });
};