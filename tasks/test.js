const gulp = require('gulp');
const exec = require('child_process').exec;

const buildProd = require('./prod.js');
const gulpMocha = require('gulp-mocha');

gulp.task('test-unit', done => {
    gulp.src('tests/**/*.ts', {read: false})
        .pipe(gulpMocha({
            reporter: 'nyan',
            ui: 'bdd',
            require: 'ts-node/register'
        }));
});

gulp.task('test-integration', done => {
   exec('mocha --require ts-node/register --ui bdd tests-integration/**/*.ts', (err, stdout, stderr) => {
       console.log(stdout);
       console.log(stderr);
       done(err);
   })
});

gulp.task('run-end2end', done => {
    gulp.src('tests-e2e/**/*.ts', {read:false})
        .pipe(gulpMocha(({
            reporter: 'nyan',
            ui: 'bdd',
            require: 'ts-node/register',
            timeout: 20000
        })))
});

gulp.task('start-server', done => {
    exec('cd ../ && pwd && pm2 start npm -- start', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        done(err);
    })
});

gulp.task('stop-server', done => [
   exec('pm2 stop npm', (err, stdout, stderr) => {
       console.log(stdout);
       console.log(stderr);
       done(err);
   })
]);

gulp.task('test-end2end', gulp.series(buildProd, 'start-server', 'run-end2end', 'stop-server'));