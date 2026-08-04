'use strict';

const gulp = require('gulp');
const del = require('del');
const watch = require('gulp-watch');
const exec = require('child_process').exec;

gulp.task('clean', () => {
  return del(['./dist', './tsconfig.tsbuildinfo']);
});

gulp.task('compile-client', (done) => {
  exec('cd src/client && npx webpack --mode=development -d eval-source-map', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

gulp.task('copy-client', function copypublic() {
  return gulp.src('./src/client/public/**/*')
    .pipe(gulp.dest('dist/client/public/'));
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('copy-client', 'compile-client'),
));

gulp.task('watch-public', () => {
  watch('src/client/public/**/*')
    .pipe(gulp.dest('dist/client/public/'));
});

gulp.task('watch-client', () => {
  gulp.watch('src/client/javascript/**/*',
    (done) => {
      exec('cd src/client && npx webpack --mode=development -d eval-source-map', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        done(err);
      });
    });
});

gulp.task('watch', gulp.series(
  gulp.parallel('watch-public', 'watch-client')),
);

gulp.task('start-dev', (done) => {
  gulp.series(
    'clean',
    gulp.parallel('copy-client', 'compile-client'),
    'watch',
  )(done);
});
