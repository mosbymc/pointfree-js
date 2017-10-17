module.exports = function _gulpConfig() {
    'use strict';
    var dist = './dist/',
        src = './src/',
        dev = './dev_browser/',
        test = './test/',
        report = test + 'report/',
        tmpPlato = './tmpPlato/',
        platoScripts = [
            tmpPlato + './dataStructures/*.js',
            tmpPlato + './groups/*.js',
            tmpPlato + './streams/**/*.js',
        ];

    return {
        distJs: dist + 'scripts/grid.js',
        dist: dist,
        src: src,
        platoScripts: platoScripts,
        srcRootJs: src + '/',
        srcContainers: src + './containers/**/*.js',
        srcFunctors: src + './containers/functors/*.js',
        srcMonads: src + './containers/monads/*.js',
        srcGroups: src + './groups/*.js',
        srcStreams: src + './streams/**/*.js',
        buildFiles: [dist + 'scripts'],
        srcFiles: [src + 'scripts'],
        temp: './.tmp/',
        routes: './routes/',
        dev: dev + '*.js',
        devRootJs: dev + '*.js',
        report: report,
        plato: {
            report: './plato',
            options: {
                title: 'pointfree-js'
            }
        },
        js: [
            dev + '**/*.js',
            './*.js',
            '!./closureExterns.js',
        ],     //Javascript file to lint
        defaultPort: 3000,
        nodeServer: './app.js',
        browserReloadDelay: 1000
    };
};