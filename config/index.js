'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/..'),

  server: {
    // Server port
    port: process.env.PORT || 9000,

    // Server ip
    ip: process.env.IP || '127.0.0.1'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = function (env, logging) {
  env = env || process.env.NODE_ENV;

  var config = _.merge(
    all,
    require('./environment/' + env + '.js') || {});

  if (logging) {
    console.log('loading config for', env);
    console.log(config);
    console.log();
  }

  return config;
};
