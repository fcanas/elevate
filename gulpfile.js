var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var fs = require('fs');

gulp.task('compile', function() {
  return browserify('src/app.js', {debug: true})
  .transform(babelify)
  .bundle()
  .pipe(fs.createWriteStream('dist/app.js'));
});

gulp.task('dev', function() {
  return gulp.watch(['src/**/*.js'], ['compile']);
});
