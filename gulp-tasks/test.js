const gulp = require('gulp');
const exec = require('child_process').exec;

const gulpMocha = require('gulp-mocha');

gulp.task('test-unit', done => {
    return gulp.src('tests/**/*.ts', {read: false})
        .pipe(gulpMocha({
            ui: 'bdd',
            require: 'ts-node/register'
        }));
});

gulp.task('test-integration', done => {
   return gulp.src('tests-integration/**/*.ts', {read:false})
       .pipe(gulpMocha({
           ui: 'bdd',
           require: 'ts-node/register',
           timeout: 100000
       }))
});

gulp.task('run-end2end', () => {
    return gulp.src('tests-e2e/**/*.ts', {read:false})
        .pipe(gulpMocha(({
            ui: 'bdd',
            require: 'ts-node/register',
            timeout: 200000
        })))
});

gulp.task('start-server', done => {
    exec('pm2 start dist/server/server.js', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        done(err);
    })
});

gulp.task('stop-server', done => [
   exec('pm2 stop server', (err, stdout, stderr) => {
       console.log(stdout);
       console.log(stderr);
       done(err);
   })
]);

gulp.task('test-end2end', gulp.series(
    'start-server',
    'run-end2end',
    'stop-server')
);