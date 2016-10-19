var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var maps = require('gulp-sourcemaps');

gulp.task('js', function() {
	return gulp.src([
			'./epoch.js'
		])
		.pipe(maps.init())
		.pipe(concat('epoch.min.js'))
		.pipe(uglify())
		.pipe(maps.write('./'))
		.pipe(gulp.dest('./'));
});

// Watch Files For Changes
gulp.task('watch', function() {
	gulp.watch('./epoch.js', ['js']);
});

gulp.task('default', ['watch', 'js']);