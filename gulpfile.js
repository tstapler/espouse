/*******************************
            Set-up
*******************************/

const gulp = require('gulp');

/* Compatibility Fix for Gulp 3 Style Tasks */
// Many Semantic UI tasks still use gulp.start() which was removed in Gulp 4+
// This shim provides backward compatibility
gulp.start = function(taskName) {
  const task = exports[taskName];
  if (typeof task === 'function') {
    return task();
  } else {
    console.warn(`Task '${taskName}' not found or not a function`);
  }
};

// read user config to know what task to load
const config = require('./tasks/config/user');

// watch for file changes and build
const watch = require('./tasks/watch');

// build all files
const build = require('./tasks/build');
const buildJS = require('./tasks/build/javascript');
const buildCSS = require('./tasks/build/css');
const buildAssets = require('./tasks/build/assets');

// utility tasks
const clean = require('./tasks/clean');
const version = require('./tasks/version');

// docs tasks
const serveDocs = require('./tasks/docs/serve');
const buildDocs = require('./tasks/docs/build');

// rtl
const buildRTL = require('./tasks/rtl/build');
const watchRTL = require('./tasks/rtl/watch');

/*******************************
             Tasks
*******************************/

// Main tasks
exports.default = watch;
exports.watch = watch;

// Build tasks
exports.build = build;
exports['build-javascript'] = buildJS;
exports['build-css'] = buildCSS;
exports['build-assets'] = buildAssets;

// Utility tasks
exports.clean = clean;
exports.version = version;

/*--------------
      Docs
---------------*/

/*
  Lets you serve files to a local documentation instance
  https://github.com/Semantic-Org/Semantic-UI-Docs/
*/

exports['serve-docs'] = serveDocs;
exports['build-docs'] = buildDocs;

/*--------------
      RTL
---------------*/

if(config.rtl) {
  exports['watch-rtl'] = watchRTL;
  exports['build-rtl'] = buildRTL;
}
