"use strict";

var path = require('path');
var _ = require('lodash');

var config = require('./config')('production');

config.info = info;
config.server.start = start;

module.exports = config;

function start() {
  if (!config.pagePath) {
    throw 'Missing required configuration: pagePath';
  }

  process.env.NODE_ENV = config.env;
  require('./server/app')(config);
}

function info() {
  return config;
}
