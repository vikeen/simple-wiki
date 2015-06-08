"use strict";

var config = require('./config'),
  path = require('path'),
  fs = require('fs');

module.exports = function (callback) {
  cleanPages(callback);
};

function cleanPages(callback) {
  fs.readdir(config.test.pages, function(err, files) {
    if (err) {
      console.error(err);
    }

    if (!files.length) {
      callback();
    }

    var count = 0;
    files.forEach(function (fileName) {
      count++;

      fs.unlink(path.join(config.test.pages, fileName), function(err) {
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
