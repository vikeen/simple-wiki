"use strict";

var _ = require('lodash'),
  config = require('./config'),
  path = require('path'),
  fs = require('fs');

module.exports = function (callback) {
  initPagesDirectory(callback);
};

function initPagesDirectory(callback) {
  fs.rmdir(config.test.pages, function (e) {
    if (e && e.code !== 'ENOENT') {
      throw e;
    }

    fs.mkdir(config.test.pages, function (e) {
      if (e) {
        throw e;
      }

      callback();
    });
  });
}

