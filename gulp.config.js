module.exports = function _gulpConfig() {
    'use strict';
    var build = './dev/',
        src = './src/',
        dev = './dev/',
        test = './test/',
        report = test + 'report/',
        scripts = [
            src + 'collation/collationFunctions.js',
            src + 'collation/concat.js',
            src + 'collation/except.js',
            src + 'collation/groupJoin.js',
            src + 'collation/intersect.js',
            src + 'collation/join.js',
            src + 'collation/union.js',
            src + 'collation/zip.js',
            src + 'evaluation/evaluationFunctions.js',
            src + 'evaluation/all.js',
            src + 'evaluation/any.js',
            src + 'evaluation/first.js',
            src + 'evaluation/last.js',
            src + 'limitation/limitationFunctions.js',
            src + 'limitation/distinct.js',
            src + 'limitation/where.js',
            src + 'projection/projectionFunctions.js',
            src + 'projection/deepFlatten.js',
            src + 'projection/flatten.js',
            src + 'projection/groupBy.js',
            src + 'projection/map.js',
            src + 'projection/orderBy.js',
            src + 'projection/sortHelpers.js',
            src + 'queryObjects/queryable.js',
            src + 'queryObjects/orderedQueryable.js',
            src + 'queryObjects/queryObjectCreators.js',
            src + 'functionalHelpers.js',
            src + 'helpers.js'
        ];

    return {
        buildJs: build + 'scripts/grid.js',
        build: build,
        src: src,
        scripts: scripts,
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
                title: 'queryable-plato'
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