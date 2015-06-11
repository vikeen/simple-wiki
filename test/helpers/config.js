"use strict";

var config = require('../../config'),
  path = require('path');


/* Move this to the test environment config */
config.test = {
  root: path.join(config.root, 'test'),
  helpers: path.join(config.root, 'test', 'helpers'),
  pages: path.join(config.root, 'test', 'pages')
};

module.exports = config;
