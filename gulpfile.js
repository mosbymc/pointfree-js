'use strict';
//firebase
var gulp = require('gulp'),
    _ = require('gulp-load-plugins')({ lazy: true }),
    config = require('./gulp.config')(),
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

gulp.task('strip-comments', function stipComments() {
    return gulp.src(config.src + '**/*.js')
        .pipe(_.stripComments())
        .pipe(gulp.dest('./tmpPlato'));
});

gulp.task('optimize', ['optimize-js'], function _optimize() {
    log('Optimizing JavaScript!');
});

gulp.task('build', ['optimize'], function _build() {
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

function log(msg) {
    if ('object' === typeof msg) {
        Object.keys(msg).forEach(function _printMsg(m) {
            _.util.log(_.util.colors.blue(m));
        });
    }
    else _.util.log(_.util.colors.blue(msg));
}