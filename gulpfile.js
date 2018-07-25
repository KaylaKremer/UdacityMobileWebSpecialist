const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
//const concat = require('gulp-concat');
//const browserify = require('browserify');
//const babelify = require('babelify');
//const source = require('vinyl-source-stream');

//For live editing
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

//For development
gulp.task('dev', ['html', 'images', 'manifest', 'styles', 'lint', 'scripts', 'sw'], () => {
	browserSync.init({
		server: "./dist",
		port: 5500,
		reloadDelay: 1000
	});
});

//For production
gulp.task('build', ['html', 'images', 'manifest', 'styles-build', 'lint', 'scripts-build', 'sw-build']);

gulp.task('html', () => {
	gulp.src('./*.html')
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

//Old task runners for Browserify
/*gulp.task('sw-dev', () => {
	const b = browserify({
		debug: false
	});
	return b
		.transform(babelify.configure({presets: ["env"]}))
		.require('./dist/sw.js', {entry: true})
		.bundle()
		.pipe(source('./sw.js'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('sw-build', () => {
	const b = browserify({
		debug: false
	});
	return b
		.transform(babelify.configure({presets: ["env"], minified: true}))
		.require('./dist/sw.js', {entry: true})
		.bundle()
		.pipe(source('./sw.js'))
		.pipe(gulp.dest('./dist'));
});*/

//Old task runners for concat
/*gulp.task('concat-idb-scripts', () => {
	gulp.src(['./js/idb.js', './js/dbhelper.js'])
		.pipe(concat('idb-bundle.js'))
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('concat-idb-scripts-build', () => {
	gulp.src(['./js/idb.js', './js/dbhelper.js'])
		.pipe(concat('idb-bundle.js'))
		.pipe(babel({minified: true}))
		.pipe(gulp.dest('./dist/js'));
});*/


