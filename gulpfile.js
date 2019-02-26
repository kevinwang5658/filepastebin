const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const watch = require('gulp-watch');

gulp.task('clean', () => {
    return del(['./dist/**/*'])
});

gulp.task('clean-client', () => {
    return del(['./dist/public/**/*', './dist/views/**/*'])
});

gulp.task('compile-ts', () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'))
});

gulp.task('copy-client', gulp.parallel(
    function copypublic() {
        return gulp.src('./src/public/**/*')
            .pipe(gulp.dest('dist/public'))
    }, function copyviews() {
        return gulp.src('./src/public/views/**/*')
            .pipe(gulp.dest('dist/views'))
    }));

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('compile-ts', 'copy-client')
));

gulp.task('watch-public', () => {
    watch('src/public/**/*', { ignoreInitial: true })
        .pipe(gulp.dest('dist/public'))
});

gulp.task('watch-views', () => {
    watch('src/views/**/*', { ignoreInitial: true })
        .pipe(gulp.dest('dist/views'))
});

gulp.task('watch', gulp.series(
    gulp.parallel('watch-public', 'watch-views'))
);
