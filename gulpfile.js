// require('require-dir')('./gulp', {recurse: true});

// Gulp
const gulp = require('gulp');
const runSequence = require('gulp4-run-sequence');
const clean = require('gulp-clean');

//  Plugins for minification CSS
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');

//  Plugins for compiling of sass to css
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

//  Plugins for compiling JS
sass.compiler = require('node-sass');

// Server
const browserSync = require('browser-sync').create();

// Copying files
gulp.task('copy', function () {
  return gulp.src('./src/**/*.*')
    .pipe(gulp.dest('build/'))
});

gulp.task('clean', function () {
  return gulp.src('./build/*')
    .pipe(clean())
});

gulp.task('copy:watch', function () {
  gulp.watch('./src/**/*', gulp.series('copy'));
});

// CSS
gulp.task('css', function () {
  return gulp.src('./build/css/main.css')
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./build/css/'));
});

gulp.task('css:watch', function () {
  gulp.watch('./build/css/main.css', gulp.series('css'));
});

// SASS
gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.{scss,sass}')
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/**/*.*', gulp.series('sass'));
});

// JavaScript
gulp.task('js', function () {
  return gulp.src("./src/js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'), {
      newLine: ';'
    })
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./build/js/"));
});

gulp.task('js:watch', function () {
  gulp.watch('./src/js/**/*.js', gulp.series('js'));
});

//  Static server
gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: './'
    },
    files: ['*.html', 'build/css/*.css', 'build/img/*.*', 'build/js/*.js']
  })
});

// Mode development
gulp.task('dev', function () {
  runSequence(
    'copy',
    'sass',
    'css',
    'js',
    ['server', 'copy:watch', 'sass:watch', 'css:watch', 'js:watch']
  );
});

// Mode production
gulp.task('build', function () {
  runSequence(
    'clean',
    'copy',
    'sass',
    'css',
    'js'
  );
});
