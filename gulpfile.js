var gulp = require('gulp')
var build = require('./semantic/tasks/build')
var sass = require('gulp-sass')
var watch = require('./semantic/tasks/watch')

// utility
var clean = require('./semantic/tasks/clean')
var version = require('./semantic/tasks/version')

gulp.task('default', ['watch'])

// Add tasks from semantic-ui
gulp.task('build', build)
gulp.task('semantic:watch', watch)

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./static/css'))
})

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass'])
})

var node_modules = [
'node_modules/jquery-parallax.js/parallax.min.js',
'node_modules/particles.js/particles.js',
'node_modules/jquery-lazy/jquery.lazy.min.js'
]

gulp.task('move', [], function () {
  var distDir = 'semantic/dist/'

  gulp.src(distDir + 'semantic.min.css').pipe(gulp.dest('static/css'))
  gulp.src(distDir + 'semantic.min.js').pipe(gulp.dest('static/js'))
  gulp.src(node_modules).pipe(gulp.dest('static/js'))
})

gulp.task('watch-dist', function () {
  gulp.watch([ 'semantic/dist/*.min.*'] + node_modules, ['move'])
})

gulp.task('watch-all', ['semantic:watch', 'watch-dist', 'sass:watch'])
