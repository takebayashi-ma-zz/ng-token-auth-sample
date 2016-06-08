/* jshint esversion: 6 */
/* globals require, -$, __dirname, Buffer */
var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')();

var isProduction = false;


var vendorUglifyOpts = {
  mangle: {
    except: ['$super'] // rickshaw requires this
  }
};

// VENDOR CONFIG
var vendor = {
  // vendor scripts required to start the app
  base: {
    source: require('./vendor.base.json'),
    dest: '.',
    name: 'base.js'
  }
};

gulp.task('vendor', ['vendor:base']);

// Build the base script to start the application from vendor assets
gulp.task('vendor:base', function() {
  return gulp.src(vendor.base.source, { base: 'bower_components' })
    .pipe($.expectFile(vendor.base.source))
    .pipe($.if( isProduction, $.uglify(vendorUglifyOpts) ))
    .pipe($.concat(vendor.base.name))
    .pipe(gulp.dest(vendor.base.dest));
});
