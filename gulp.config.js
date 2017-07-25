module.exports = function _gulpConfig() {
    'use strict';
    var build = './dev/',
        src = './src/',
        dev = './dev/',
        test = './test/',
        report = test + 'report/',
        tmpPlato = './tmpPlato/',
        platoScripts = [
            tmpPlato + 'collation/collationFunctions.js',
            tmpPlato + 'collation/prepend.js',
            tmpPlato + 'collation/concat.js',
            tmpPlato + 'collation/except.js',
            tmpPlato + 'collation/groupJoin.js',
            tmpPlato + 'collation/intersect.js',
            tmpPlato + 'collation/join.js',
            tmpPlato + 'collation/union.js',
            tmpPlato + 'collation/zip.js',
            tmpPlato + 'evaluation/evaluationFunctions.js',
            tmpPlato + 'evaluation/all.js',
            tmpPlato + 'evaluation/any.js',
            tmpPlato + 'evaluation/counts.js',
            tmpPlato + 'evaluation/first.js',
            tmpPlato + 'evaluation/fold.js',
            tmpPlato + 'evaluation/last.js',
            tmpPlato + 'evaluation/count.js',
            tmpPlato + 'limitation/limitationFunctions.js',
            tmpPlato + 'limitation/distinct.js',
            tmpPlato + 'limitation/ofType.js',
            tmpPlato + 'limitation/where.js',
            tmpPlato + 'projection/projectionFunctions.js',
            tmpPlato + 'projection/deepFlatten.js',
            tmpPlato + 'projection/deepMap.js',
            tmpPlato + 'projection/flatten.js',
            tmpPlato + 'projection/groupBy.js',
            tmpPlato + 'projection/map.js',
            tmpPlato + 'projection/orderBy.js',
            tmpPlato + 'projection/sortHelpers.js',
            tmpPlato + 'queryObjects/queryable.js',
            tmpPlato + 'queryObjects/queryDelegatorCreators.js',
            tmpPlato + 'functionalHelpers.js',
            tmpPlato + 'helpers.js'
        ];

    return {
        buildJs: build + 'scripts/grid.js',
        build: build,
        src: src,
        platoScripts: platoScripts,
        srcRootJs: src + '/',
        srcContainers: src + '/containers/**/*.js',
        srcFunctors: src + '/containers/functors/*.js',
        srcMonads: src + './containers/monads/*.js',
        srcGroups: src + './groups/*.js',
        srcStreams: src + './streams/**/*.js',
        buildFiles: [build + 'scripts'],
        srcFiles: [src + 'scripts'],
        temp: './.tmp/',
        routes: './routes/',
        dev: dev + '*.js',
        devRootJs: dev + '*.js',
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