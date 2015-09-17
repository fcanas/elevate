var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('compile', function(src) {
  return gulp.src(['index.js', 'graphics.js', 'editor.js'])
  .pipe(gulp.dest('dist'));
});

gulp.task('dev', function() {
  return gulp.watch(['index.js', 'graphics.js', 'editor.js'], ['compile']);
});
