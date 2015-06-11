"use strict";

var _ = require('lodash'),
  config = require('../../config')('test'),
  path = require('path'),
  fs = require('fs');

module.exports = function (callback) {
  cleanPages(callback);
};

function cleanPages(callback) {
  fs.readdir(config.pagePath, function (err, files) {
    if (err) {
      console.error(err);
    }

    if (!files.length) {
      callback();
    }

    var count = 0;
    files.forEach(function (fileName) {
      count++;

      fs.unlink(path.join(config.pagePath, fileName), function (err) {
        if (err) {
          console.error(err);
        }

        if (0 === --count) {
          callback();
        }
      });
    });
  });
}
