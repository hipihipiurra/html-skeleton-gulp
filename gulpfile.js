/*
 * Requirements
 */

let gulp 					= require('gulp');
let sass 					= require('gulp-sass');
let rename 				= require('gulp-rename');
let cleanCSS 			= require('gulp-clean-css');
let concat 				= require('gulp-concat');
let uglify 				= require('gulp-uglify');
let pump 					= require('pump');
let browserSync 	= require('browser-sync').create();
let reload      	= browserSync.reload;

/*
 * Variables
 */

var path_default 		= './assets'
,		php_files				= './**/*.php'
,		html_files			= './**/*.html'
,		sass_path 			= path_default + '/sass'
,		sass_files 			= path_default + '/sass/**/*.scss'
,		sass_file 			= path_default + '/sass/style.scss'
,		css_path 				= path_default + '/css'
,		css_files 			= path_default + '/css/**/*.css'
,		js_path					= path_default + '/js'
, 	js_files				= path_default + '/js/**/*.js'
,		dist_path 			= path_default + '/dist'
;

let all_files = [ sass_files, css_files, js_files, php_files, html_files ];

/*
 * Tasks
 */

// Sass task

gulp.task('sassdev', () => {
  return gulp.src(sass_file)
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(gulp.dest(css_path));
});

// CSS task

gulp.task('minify-css', () => {
  return gulp.src(css_files)
  	.pipe(concat('dist'))
    .pipe(rename('style.min.css'))
    .pipe(cleanCSS())
  	.pipe(gulp.dest(dist_path));
});

// JS task

gulp.task('compress', (cb) => {
  pump([
        gulp.src(js_files),
        uglify(),
        rename('scripts.min.js'),
        gulp.dest(dist_path)
    ],
    cb
  )
});

/*
 * Browser sync task
 */

gulp.task('serve', () => {
	browserSync.init(null, {
		proxy: "http://localhost",
		files: all_files
	});
});

/*
 * Gulp task
 */

// Task 'watch' - Run with command 'gulp watch'

gulp.task('watch', () => {
  gulp.watch(sass_files, ['sassdev']);
  gulp.watch(css_files, ['minify-css']);
  gulp.watch(js_files, ['compress']);
  gulp.watch(all_files).on('change', reload);
});

// Default task - Run with command 'gulp'

gulp.task('default', [
	'watch',
	'sassdev',
	'minify-css',
	'compress',
	'serve'
]);




