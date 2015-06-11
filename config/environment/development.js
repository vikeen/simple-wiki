'use strict';

var path = require('path');

// Development specific configuration
// ==================================
module.exports = {
  env: 'development',
  pagePath: path.normalize(__dirname + '/../../server/pages')
};
