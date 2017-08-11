'use strict';
//firebase
var gulp = require('gulp'),
    args = require('yargs').argv,
    _ = require('gulp-load-plugins')({ lazy: true }),
    config = require('./gulp.config')(),
    del = require('del'),
    browserSync = require('browser-sync'),
    port = process.env.port || config.defaultPort,
    transpileDependencies = ['transpile-root'];

gulp.task('help', _.taskListing);
gulp.task('default', ['help']);

gulp.task('babel-dev', ['clean-tmp'], function _babelDev() {
    process.env.BABEL_ENV = 'build';
    process.env.NODE_ENV = 'build';

    return gulp.src('./src/**/*.js')
        .pipe(_.babel())
        .pipe(gulp.dest('./tmp'));
});

gulp.task('clean-dev', function _cleanDevBuild(done) {
    log('cleaning dev pointfree.js');
    clean(config.dev + 'pointfree.js', done);
});

gulp.task('clean-tmp', function _cleanTmp(done) {
    log('Cleaning tmp');
    clean('./tmp', done);
});

gulp.task('plato', ['strip-comments', 'generate-plato'], function _plato(done) {
    log('Cleaning: ' + _.util.colors.blue('./tmpPlato'));
    del('./tmpPlato', done);
});

gulp.task('strip-comments', function stipComments() {
    return gulp.src(config.src + '**/*.js')
        .pipe(_.stripComments())
        .pipe(gulp.dest('./tmpPlato'));
});

gulp.task('generate-plato', function _plato(done) {
    var plato = require('plato'),
        options = {
            title: 'pointfree-js',
            recurse: true,
            noempty: true
        };

    plato.inspect('src', './plato', options, function noop(){
        done();
    });
});

gulp.task('clean', function _clean(done) {
    var deleteConfig = [].concat(config.dist, config.src);
    log('Cleaning: ' + _.util.colors.blue(deleteConfig));
    del(deleteConfig, done);
});

gulp.task('clean-code', function _clean_code(done) {
    log('Cleaning code!');
    clean([config.src + 'scripts/**/*.*'], done);
});

gulp.task('optimize', ['optimize-js'], function _optimize() {
    log('Optimizing JavaScript!');
});

gulp.task('build', ['optimize'], function _build() {
    var plato = require('plato');
    plato.inspect(config.src + 'scripts/grid.js', config.plato.report, config.plato.options, function noop(){
        //done();
    });
});

gulp.task('optimize-js', ['clean-code'], function _optimize() {
    log('Optimizing JavaScript');
    return gulp.src(config.gridJs)
        .pipe(_.plumber())
        .pipe(_.stripComments())
        .pipe(gulp.dest(config.src + 'scripts'))
        .pipe(_.closureCompiler({
            compilerPath: 'C:\\ClosureCompiler\\compiler.jar',
            fileName: 'grid.min.js',
            compilerFlags: {
                compilation_level: 'SIMPLE_OPTIMIZATIONS',
                language_in: 'ECMASCRIPT5_STRICT',
                language_out: 'ECMASCRIPT5_STRICT',
                warning_level: 'DEFAULT',
                externs: ['./closureExterns.js'],
                create_source_map: 'D:\\Repo\\personal_projects\\grid\\dist\\scripts\\grid.min.map.js'
            }
        }))
        .pipe(gulp.dest(config.src + 'scripts'));
});

gulp.task('transpile', transpileDependencies, function _transpile() {
    log('Transpiling Dev code!');
    return true;
});

gulp.task('transpile-root', function _transpileRoot() {
    return gulp.src(config.devRootJs)
        .pipe(_.babel())
        .pipe(gulp.dest(config.srcRootJs));
});

gulp.task('transpile-testData', function _transpileTestData() {
    return gulp.src('./test/testData.js')
        .pipe(_.babel())
        .pipe(_.rename('es5TestData.js'))
        .pipe(gulp.dest('./test/'));
});

gulp.task('dev-server', function _devServer() {
    serve(true /*isDev*/);
});

gulp.task('build-server', ['optimize'], function _buildServer() {
    serve(false /*isDev*/);
});

gulp.task('set_node_env', function _env() {
    process.env.BABEL_ENV = 'dev';
    return process.env.NODE_ENV = 'dev';
});

function serve(isDev) {
    return _.nodemon({
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.routes, config.dev + 'scripts/']
    })
        .on('restart', ['lint'], function _restart(evt) {
            log('*** nodemon restarted ***');
            log('Files changed on restart:\n' + evt);
            setTimeout(function browserSyncDelayCallback() {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        })
        .on('start', function _start() {
            log('*** nodemon started ***');
            startBrowserSync(isDev);
        })
        .on('crash', function _crash() {
            log('*** nodemon crashed ***');
        })
        .on('exit', function _exit() {
            log('*** nodemon exited cleanly ***');
        });
}

function startBrowserSync(isDev) {
    if (args.nosync || browserSync.active)  //gulp dev-server --nosync: prevents browser-sync from reloading on changes
        return;

    log('Starting browser-sync on port: ' + port);
    gulp.watch([config.js], [browserSync.reload])
        .on('change', function _change(evt) {
            changeEvent(evt);
        });

    browserSync({
        proxy: 'localhost:' + port + '/public/grid.html',
        port: 3030,
        files: isDev ? [
                config.dev + '**/*.*',
                config.temp + '**/*.*',
                config.routes + '**/*.*'
            ] : [],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scrolling: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-browser-sync',
        notify: true,
        reloadDelay: 0
    });
}

function changeEvent(evt) {
    var sourcePattern = new RegExp('/.*(?=/' + config.dev + ')/'),
        tempPattern = new RegExp('/.*(?=/' + config.temp + ')/'),
        routePattern = new RegExp('/.*(?=/' + config.routes + ')/'),
        publicPattern = new RegExp('/.*(?=/' + config.dev + ')/');
    log('File ' + evt.path.replace(sourcePattern, '') + evt.path.replace(tempPattern, '') + evt.path.replace(routePattern, '') + evt.path.replace(publicPattern, '') + ' ' + evt.type);
}

function clean(path, done) {
    log('Cleaning ' + _.util.colors.blue(path));
    del(path).then(done());
}

function log(msg) {
    if ('object' === typeof msg) {
        Object.keys(msg).forEach(function _printMsg(m) {
            _.util.log(_.util.colors.blue(m));
        });
    }
    else _.util.log(_.util.colors.blue(msg));
}