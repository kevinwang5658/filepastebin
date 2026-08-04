const gulp = require('gulp');
const del = require('del');
const exec = require('child_process').exec;

gulp.task('clean-prod', () => {
  return del(['./dist']);
});

gulp.task('compile-client-prod', (done) => {
  exec('cd src/client && npx webpack --mode=production', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

gulp.task('copy-client-assets-prod', function copypublic() {
  return gulp.src('./src/client/public/**/*')
    .pipe(gulp.dest('dist/client/public/'));
});

// Assembles dist/pages/ for Cloudflare Pages deployment
gulp.task('copy-pages-assets', function() {
  return gulp.src('./src/client/public/**/*')
    .pipe(gulp.dest('dist/pages/'));
});

gulp.task('copy-pages-js', function() {
  return gulp.src('./dist/client/javascript/**/*')
    .pipe(gulp.dest('dist/pages/javascript/'));
});

gulp.task('build-prod', gulp.series(
  'clean-prod',
  gulp.parallel('copy-client-assets-prod', 'compile-client-prod'),
));

gulp.task('build-pages', gulp.series(
  'clean-prod',
  'compile-client-prod',
  gulp.parallel('copy-pages-assets', 'copy-pages-js'),
));
