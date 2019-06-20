const gulp = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const sass = require('gulp-sass');

const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function () {
    return del(['dist']);
});

gulp.task('sass', function () {
    return gulp.src('./src/sass/**/*')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(sourcemaps.write('./', {addComment: true}))
        .pipe(gulp.dest('./dist/css'));

});


gulp.task('copyjs', function () {
    return gulp.src('./src/js/**/*')
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function () {
    gulp.watch('./src/sass/**/*', ['sass']);
    gulp.watch('./src/js/**/*', ['copyjs']);
});

gulp.task('uglifyjs',function () {
    return gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('cleancss',function () {
    return gulp.src('dist/css/**/*.css')
        .pipe(cleancss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('build',
    gulp.series('clean','uglifyjs','copyjs', 'sass','cleancss','sass')
);

gulp.task('default', gulp.series('clean', gulp.parallel('copyjs', 'sass'),
    function watcher(done) {
        gulp.watch('./src/sass/**/*', gulp.parallel('sass'));
        gulp.watch('./src/js/**/*', gulp.parallel('copyjs'));
    })
);


// npx gulp copylibsAndImg && npx gulp server

