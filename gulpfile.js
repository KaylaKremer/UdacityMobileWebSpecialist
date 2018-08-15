const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const gzip = require('gulp-gzip');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

//For live editing - gulp watch
gulp.task('watch', ['html', 'images', 'manifest', 'styles', 'lint', 'scripts', 'sw'], () => {
	gulp.watch('./css/**/*.css', ['styles']);
	gulp.watch('./js/**/*.js', ['lint', 'scripts']);
	gulp.watch('./sw.js', ['lint', 'sw']);
	gulp.watch('./index.html', ['html']);
	gulp.watch('./restaurant.html', ['html']);
	gulp.watch('./dist/css/**/*.css').on('change', browserSync.reload);
	gulp.watch('./dist/js/**/*.js').on('change', browserSync.reload);
	gulp.watch('./dist/sw.js').on('change', browserSync.reload);
	gulp.watch('./dist/index.html').on('change', browserSync.reload);
	gulp.watch('./dist/restaurant.html').on('change', browserSync.reload);

	browserSync.init({
		server: "./dist",
		port: 5500,
		reloadDelay: 1000
	});
});

//For development - gulp dev
gulp.task('dev', ['html', 'images', 'manifest', 'styles', 'lint', 'scripts', 'sw'], () => {
	browserSync.init({
		server: "./dist",
		port: 5500,
		reloadDelay: 1000
	});
});

//For compress - gulp compress
gulp.task('compress', ['html-compress', 'images', 'manifest', 'styles-compress', 'lint', 'scripts-compress', 'sw-compress'], () => {
	browserSync.init({
		server: "./dist",
		port: 5500,
		reloadDelay: 1000
	});
});

//For production - gulp build
gulp.task('build', ['html', 'html-compress', 'images', 'manifest', 'styles-build', 'styles-compress', 'lint', 'scripts-build', 'scripts-compress', 'sw-build', 'sw-compress'], () => {
	browserSync.init({
		server: "./dist",
		port: 5500,
		reloadDelay: 1000
	});
});

gulp.task('html', () => {
	gulp.src('./*.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('html-compress', () => {
	gulp.src('./*.html')
		.pipe(gzip())
		.pipe(gulp.dest('./dist'));
});

gulp.task('images', () => {
	gulp.src(['./img/**/*.webp', './img/**/*.png', './img/**/favicon.ico'])
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('manifest', () => {
	gulp.src('./manifest.json')
		.pipe(gulp.dest('./dist'));
});

gulp.task('styles', () => {
	gulp.src('./css/**/*.css')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('styles-build', () => {
	gulp.src('./css/**/*.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cleanCSS())
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('styles-compress', () => {
	gulp.src('./css/**/*.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cleanCSS())
		.pipe(gzip())
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('lint', () => {
	return gulp.src(['./js/**/*.js', './sw.js', '!node_modules/**'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('scripts', () => {
	gulp.src('./js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('scripts-build', () => {
	gulp.src('./js/**/*.js')
		.pipe(babel({minified: true}))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('scripts-compress', () => {
	gulp.src('./js/**/*.js')
		.pipe(babel({minified: true}))
		.pipe(uglify())
		.pipe(gzip())
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('sw', () => {
	gulp.src('./sw.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist'));
});

gulp.task('sw-build', () => {
	gulp.src('./sw.js')
		.pipe(babel({minified: true}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('sw-compress', () => {
	gulp.src('./sw.js')
		.pipe(babel({minified: true}))
		.pipe(gzip())
		.pipe(gulp.dest('./dist'));
});