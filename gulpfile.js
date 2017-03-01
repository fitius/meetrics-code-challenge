var gulp  = require('gulp'),
    concat = require('gulp-concat'),
    htmlmin = require('gulp-htmlmin'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish');

gulp.task('process-html', function() {
    return gulp.src('./html/*.html')
        .pipe(gulp.dest('./output'));
});

gulp.task('process-js', function() {
    return gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./output'));
});

gulp.task('default', ['process-html', 'process-js']);