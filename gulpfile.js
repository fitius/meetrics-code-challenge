var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    htmlmin = require('gulp-htmlmin');

gulp.task('process-html', function() {
    return gulp.src('./html/*.html')
        //only uglify if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'prod' ?  htmlmin({collapseWhitespace: true}) : gutil.noop())
        .pipe(gulp.dest('./output'));
});

gulp.task('process-js', function() {
    return gulp.src('./js/*.js')
        .pipe(concat('script.js'))
        //only uglify if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'prod' ? uglify() : gutil.noop())
        .pipe(gulp.dest('./output'));
});

gulp.task('default', ['process-html', 'process-js']);