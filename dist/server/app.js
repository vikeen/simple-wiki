'use strict';

var fs = require('fs'),
    _ = require('lodash');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');

// Expose app
module.exports = function (externalConfig) {
  // Setup server
  var app = express();
  var server = require('http').createServer(app);
  require('./config/express')(app);
  require('./routes')(app);

  console.log(config);
  config = _.merge(config, externalConfig);
  console.log(config);

  server.listen(config.server.port, config.server.ip, function () {
    console.log('Simple Wiki server listening on %d, in %s mode', config.server.port, app.get('env'));
  });
};
