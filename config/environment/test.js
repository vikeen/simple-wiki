'use strict';

var path = require('path');

// Test specific configuration
// ===========================
module.exports = {
  env: 'test',

  pagePath: path.normalize(__dirname + '/../../test/pages'),

  root: path.normalize(__dirname + '/../../'),

  helpersPath: path.normalize(__dirname + '/../../test', 'helpers')
};
