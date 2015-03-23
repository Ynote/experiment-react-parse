# modules
gulp      = require 'gulp'
plumber   = require 'gulp-plumber'
minifycss = require 'gulp-minify-css'
uglify    = require 'gulp-uglify'
react     = require 'gulp-react'

# conf
jsxPath = 'public/js/src/*.jsx'
cssPath = 'public/css/*.css'

# tasks
gulp.task 'jsx', ->
    gulp.src jsxPath
        .pipe(plumber())
        .pipe(react())
        .pipe(uglify())
        .pipe(plumber.stop())
        .pipe(gulp.dest 'public/js/build')

gulp.task 'css', ->
    gulp.src cssPath
        .pipe(plumber())
        .pipe(minifycss())
        .pipe(plumber.stop())
        .pipe(gulp.dest 'public/css/gen')

gulp.task 'default', ->
    gulp.watch jsxPath, ['jsx']
    gulp.watch cssPath, ['css']
