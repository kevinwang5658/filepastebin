const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const nodemon = require('gulp-nodemon');
const tsProject = ts.createProject('tsconfig.json');
const tsClient = ts.createProject('./src/client/tsconfig.json');
const watch = require('gulp-watch');

gulp.task('clean', () => {
    return del(['./dist'])
});

gulp.task('compile-ts', () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'))
});

gulp.task('compile-client', () => {
    return gulp.src('./src/client/public/javascript/**/*')
        .pipe(tsClient())
        .js.pipe(gulp.dest('dist/client/public/javascript'))
});

gulp.task('copy-client', gulp.parallel(
    function copypublic() {
        return gulp.src('./src/client/public/styles/**/*')
            .pipe(gulp.dest('dist/client/public/styles'))
    }, function copyviews() {
        return gulp.src('./src/client/views/**/*')
            .pipe(gulp.dest('dist/client/views'))
    }));

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('compile-ts', 'copy-client')
));

gulp.task('watch-public', () => {
    watch('src/client/public/styles/**/*', { ignoreInitial: true })
        .pipe(gulp.dest('dist/client/public/styles'))
});

gulp.task('watch-views', () => {
    watch('src/client/views/**/*', { ignoreInitial: true })
        .pipe(gulp.dest('dist/client/views'))
});

gulp.task('watch-client', () => {
   watch('src/client/public/javascript/**/*', { ignoreInitial: true})
       .pipe(tsClient())
       .js
       .pipe(gulp.dest('dist/client/public/javascript'))
});

gulp.task('nodemon', gulp.series('compile-ts', (done) => {
    return nodemon({
        script: 'dist/server/server.js',
        watch: ['src/server', 'src/constants'],
        tasks: ['compile-ts'],
        done: done
    })
}));

gulp.task('watch', gulp.series(
    gulp.parallel('watch-public', 'watch-views', 'watch-client'))
);

gulp.task('start-dev', (done)=> {
    gulp.series(
        'clean',
        gulp.parallel('copy-client', 'compile-client'),
        gulp.parallel('nodemon', 'watch'))(done)
});
