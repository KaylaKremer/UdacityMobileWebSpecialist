const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const browserify = require('browserify');
const babelify = require('babelify');
const source = require("vinyl-source-stream");

//For live editing
gulp.task('watch', ['copy-html', 'copy-images', 'styles', 'lint', 'scripts'], () => {
	gulp.watch('./css/**/*.css', ['styles']);
	gulp.watch('./js/**/*.js', ['lint', 'scripts']);
	gulp.watch('./sw.js', ['lint', 'sw']);
	gulp.watch('./index.html', ['copy-html']);
	gulp.watch('./dist/js/**/*.js').on('change', browserSync.reload);
	gulp.watch('./dist/index.html').on('change', browserSync.reload);
	gulp.watch('./dist/restaurant.html').on('change', browserSync.reload);

	browserSync.init({
		server: "./dist",
		port: 5500,
		reloadDelay: 1000
	});
});

//For development build
gulp.task('build', ['copy-html', 'copy-images', 'styles', 'lint', 'scripts', 'sw']);

//For production build
gulp.task('build:production', ['copy-html', 'copy-images', 'styles-build', 'lint', 'scripts-build', 'sw-build']);

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
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/js'));
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
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-html', () => {
	gulp.src('./*.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', () => {
	gulp.src('img/*')
		.pipe(gulp.dest('./dist/img'));
});

//Still working on sw tasks!
//To Do: Add source mapping
gulp.task('sw', () => {
	const b = browserify({
		debug: true
	});
	return b
		.transform(babelify)
		.require('./dist/sw.js', {entry: true})
		.bundle()
		.pipe(source('./sw.js'))
		.pipe(gulp.dest('./dist'));
});

//To Do: Add source mapping, minification(uglify)
gulp.task('sw-build', () => {
	const b = browserify({
		debug: true
	});
	return b
		.transform(babelify)
		.require('./dist/sw.js', {entry: true})
		.bundle()
		.pipe(source('./sw.js'))
		.pipe(gulp.dest('./dist'));
});


