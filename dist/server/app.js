'use strict';

var _ = require('lodash');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('../config')(process.env.NODE_ENV, process.env.NODE_ENV !== 'production');

// Expose app
module.exports = function (externalConfig) {
  config = _.merge(config, externalConfig);

  // Setup server
  var app = express();
  var server = require('http').createServer(app);
  require('../config/express')(app);
  require('./routes')(app);

  server.listen(config.server.port, config.server.ip, function () {
    console.log('Simple Wiki server listening on %d, in %s mode', config.server.port, app.get('env'));
  });
};
