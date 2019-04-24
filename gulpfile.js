const gulp = require('gulp');
const minify = require('gulp-minify');
const del = require('del');
const babel = require('gulp-babel');

gulp.task('clean', () => del(['build/*'], {dot: true}));

gulp.task('copyHtml', function () {
    return gulp.src('html/*')
        .pipe(gulp.dest('build/html'))
});

gulp.task('copyImage', function () {
    return gulp.src('img/*')
        .pipe(gulp.dest('build/img'))
});

gulp.task('copyJSON', function () {
    return gulp.src('manifest.json')
        .pipe(gulp.dest('build'))
});

gulp.task('default', gulp.series('clean', 'copyHtml', 'copyJSON', 'copyImage', function () {
    return gulp.src('js/*.js')
        .pipe(babel({
            presets: [
                [
                    '@babel/env',
                    {
                        "targets": {
                            "chrome": "1",
                        }
                    },
                ]
            ]
        }))
        .pipe(minify({
            noSource: true,
            ext: {
                min: '.js'
            },
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        }))
        .pipe(gulp.dest('build/js'));
}));