const gulp = require('gulp');

const gulpMocha = require('gulp-mocha');

gulp.task('test-unit', () => {
  return gulp.src('tests/**/*.ts', { read: false })
    .pipe(gulpMocha({
      ui: 'bdd',
      require: 'ts-node/register',
    }));
});

gulp.task('test-integration', () => {
  return gulp.src('tests-integration/**/*.ts', { read: false })
    .pipe(gulpMocha({
      ui: 'bdd',
      require: 'ts-node/register',
      timeout: 100000,
    }));
});