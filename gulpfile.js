var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify"),
    pkg = require("./package.json"),
    clean = require("gulp-clean"),
    header = require('gulp-header');

gulp.task('clean', function(){
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

var banner = ['/*!',
    ' * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>',
    ' * Copyright Maarten Schroeven and other contributors',
    ' * Released under the MIT license',
    ' */',
    ''].join('\n');

gulp.task('build', function () {
    return gulp.src([
            'src/angular-mew.module.js',
            'src/angular-mew.constants.js',
            'src/hawk-configuration.service.js',
            'src/hawk-interceptor.service.js',
            'src/angular-mew.config.js',
            'src/angular-mew.run.js'
        ])
        .pipe(concat(pkg.name + '.js'))
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest('dist'))
        .pipe(uglify({preserveComments: 'license'}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean', 'build']);