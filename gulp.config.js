module.exports = function _gulpConfig() {
    'use strict';
    var build = './dev/',
        src = './src/',
        dev = './dev/',
        test = './test/',
        report = test + 'report/';

    return {
        buildJs: build + 'scripts/grid.js',
        build: build,
        src: src,
        srcRootJs: src + '/',
        srcCollationJs: src +'collation/',
        srcEvaluationJs: src + 'evaluation/',
        srcExpressionParserJs: src + 'expressionParser/',
        srcLimitationJs: src + 'limitation/',
        srcMutationJs: src + 'mutation/',
        srcProjectionJs: src + 'projection/',
        srcQueryObjectJs: src + 'queryObjects/',
        srcTransformationJs: src + 'transformation/',
        buildFiles: [build + 'scripts'],
        srcFiles: [src + 'scripts'],
        gridJs: dev + 'scripts/grid.js',
        temp: './.tmp/',
        routes: './routes/',
        dev: dev + '*.js',
        devRootJs: dev + '*.js',
        devCollationJs: dev +'collation/*.js',
        devEvaluationJs: dev + 'evaluation/*.js',
        devExpressionParserJs: dev + 'expressionParser/*.js',
        devLimitationJs: dev + 'limitation/*.js',
        devMutationJs: dev + 'mutation/*.js',
        devProjectionJs: dev + 'projection/*.js',
        devQueryObjectJs: dev + 'queryObjects/*.js',
        devTransformationJs: dev + 'transformation/*.js',
        report: report,
        plato: {
            report: './plato',
            options: {
                title: 'grid-plato',
                jshint: __dirname + '/.jshintrc'
            }
        },
        js: [
            dev + '**/*.js',
            './*.js',
            '!./closureExterns.js',
            '!./karma.conf.js'
        ],     //Javascript file to lint
        defaultPort: 3000,
        nodeServer: './app.js',
        browserReloadDelay: 1000
    };
};