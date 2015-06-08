'use strict';

var path = require('path');
var _ = require('lodash');

var all = {
  env: 'production',

  // Root path of server
  root: path.join(__dirname, '..'),

  // Paths
  faviconPath: undefined,
  pagePath: undefined, // required for application

  server: {
    port: process.env.PORT || 9000,
    ip: process.env.IP | '127.0.0.1'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = all;
