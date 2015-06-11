"use strict";

var _ = require('lodash'),
  config = require('../../config')('test'),
  path = require('path'),
  fs = require('fs');

module.exports = function (callback) {
  initPagesDirectory(callback);
};

function initPagesDirectory(callback) {
  fs.rmdir(config.pagePath, function (e) {
    if (e && e.code !== 'ENOENT') {
      throw e;
    }

    fs.mkdir(config.pagePath, function (e) {
      if (e) {
        throw e;
      }

      callback();
    });
  });
}

