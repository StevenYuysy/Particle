var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('connect', function() {
    connect.server();
});

gulp.task('close', function() {
    connect.serverClose();
});

gulp.task('default', ['connect', 'close']);
