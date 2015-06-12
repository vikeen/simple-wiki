"use strict";

var path = require('path');

var config = {
  env: 'production',

  // Root path of server
  root: path.normalize(__dirname + '/../../'),

  // Paths
  faviconPath: undefined,
  pagePath: undefined, // required for application

  server: {
    port: process.env.PORT || 9000,
    ip: process.env.IP || '127.0.0.1'
  }
};

module.exports = config;
