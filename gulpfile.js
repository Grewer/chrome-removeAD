const {series, dest, src, parallel} = require('gulp')
const del = require('del');
const minify = require('gulp-minify');
const htmlmin = require('gulp-htmlmin');
const minifyInline = require('gulp-minify-inline');
const ts = require('gulp-typescript')

const tsProject = ts.createProject('tsconfig.json')

function clean() {
    return del(['build/*'], {dot: true})
}

function miniHtml() {
    return src('src/html/*')
        .pipe(minifyInline())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(dest('build/html'))

}

function copyImage() {
    return src('src/img/*')
        .pipe(dest('build/img'))

}

function copyJSON() {
    return src('src/manifest.json')
        .pipe(dest('build'))

}

function compile() {
    return tsProject
        .src()
        .pipe(tsProject())
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
        .pipe(dest('build/js'))
}

// gulp.task('default', gulp.series('clean', 'miniHtml', 'copyJSON', 'copyImage', function () {
//     return gulp.src('src/js/*.js')
//         .pipe(babel({
//             presets: [
//                 [
//                     '@babel/env',
//                     {
//                         "targets": {
//                             "chrome": "1",
//                         }
//                     },
//                 ]
//             ]
//         }))
//         .pipe(minify({
//             noSource: true,
//             ext: {
//                 min: '.js'
//             },
//             compress: {
//                 warnings: false,
//                 drop_debugger: true,
//                 drop_console: true
//             }
//         }))
//         .pipe(gulp.dest('build/js'));
// }));

exports.default = series(clean, parallel(miniHtml, copyJSON, copyImage, compile))
