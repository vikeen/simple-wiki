"use strict";

var path = require('path');
var _ = require('lodash');

var config = {
  // Root path of server
  root: path.join(__dirname, '..'),

  // Paths
  faviconPath: undefined,
  pagePath: undefined, // required for application

  server: {
    port: process.env.PORT || 9000,
    ip: process.env.IP || '127.0.0.1',
    start: start
  },

  info: info
};

module.exports = config;

function start() {
  if (!config.pagePath) {
    throw 'Missing required confiuration: pagePath';
  }

  config.env = 'production';
  process.env.NODE_ENV = config.env;
  require('./server/app')(config);
}

function info() {
  return config;
}
