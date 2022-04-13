const gulp = require('gulp');
const del = require('del');
const nodemon = require('gulp-nodemon');
const watch = require('gulp-watch');
const exec = require('child_process').exec;

gulp.task('clean', () => {
  return del(['./dist', './tsconfig.tsbuildinfo']);
});

gulp.task('compile-ts', (done) => {
  exec('tsc', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

gulp.task('compile-client', (done) => {
  exec('cd src/client && node fuse-dev', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

gulp.task('copy-client', gulp.parallel(
  function copypublic() {
    return gulp.src('./src/client/public/**/*')
      .pipe(gulp.dest('dist/client/public/'));
  }, function copyviews() {
    return gulp.src('./src/client/views/**/*')
      .pipe(gulp.dest('dist/client/views'));
  }));

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('compile-ts', 'copy-client'),
));

gulp.task('watch-public', () => {
  watch('src/client/public/**/*')
    .pipe(gulp.dest('dist/client/public/'));
});

gulp.task('watch-views', () => {
  watch('src/client/views/**/*')
    .pipe(gulp.dest('dist/client/views'));
});

gulp.task('watch-client', () => {
  gulp.watch('src/client/javascript/**/*',
    (done) => {
      exec('cd src/client && node fuse-dev', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        done(err);
      });
    });
});

gulp.task('nodemon', (done) => {
  return nodemon({
    script: 'dist/server/server.js',
    watch: ['src/server'],
    tasks: ['compile-ts'],
    done: done,
  });
});

gulp.task('watch', gulp.series(
  gulp.parallel('watch-public', 'watch-views', 'watch-client')),
);

gulp.task('start-dev', (done) => {
  gulp.series(
    'clean',
    'compile-ts',
    gulp.parallel('copy-client', 'compile-client'),
    gulp.parallel('nodemon', 'watch'),
  )(done);
});

