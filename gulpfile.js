'use strict';
//firebase
var gulp = require('gulp'),
    _ = require('gulp-load-plugins')({ lazy: true }),
    config = require('./gulp.config')();

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

gulp.task('optimize-js', ['clean-code'], function _optimize() {
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