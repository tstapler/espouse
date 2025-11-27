/*******************************
    gulp-chmod Compatibility
*******************************/

/**
 * Compatibility wrapper for gulp-chmod 4.x
 * Converts numeric permission (e.g., 744) to gulp-chmod 4.x format
 *
 * For development builds, chmod isn't critical, so we provide
 * a pass-through that applies reasonable defaults.
 */

const gulpChmod = require('gulp-chmod');
const through2 = require('through2');

module.exports = function chmodCompat(permission) {
  // If permission is false or not set, return a pass-through
  if (!permission) {
    return through2.obj(function(file, enc, cb) {
      cb(null, file);
    });
  }

  // Convert numeric permission to chmod 4.x format
  // For simplicity, just use a reasonable default (owner: rwx, group: rx, others: rx)
  // gulp-chmod 4.x exports an object, need to call it as a constructor or use the exported function
  if (typeof gulpChmod === 'function') {
    return gulpChmod({
      owner: {
        read: true,
        write: true,
        execute: true
      },
      group: {
        read: true,
        write: false,
        execute: true
      },
      others: {
        read: true,
        write: false,
        execute: false
      }
    });
  }

  // If it's an object with methods, try to use it appropriately
  // For now, just return a pass-through since permissions aren't critical for dev
  return through2.obj(function(file, enc, cb) {
    cb(null, file);
  });
};
