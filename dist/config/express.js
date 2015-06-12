'use strict';

var express = require('express'),
  favicon = require('serve-favicon'),
  morgan = require('morgan'),
  compression = require('compression'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  errorHandler = require('errorhandler'),
  path = require('path');

module.exports = function (app, config) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.set('view engine', 'jade');
  app.use(compression());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());

  var faviconPath = config.faviconPath || path.join(config.root, 'public', 'favicon.ico');
  app.use(favicon(faviconPath));
  app.use(express.static(path.join(config.root, 'public')));
  app.set('appPath', config.root + '/public');
  app.use(morgan('dev'));
};
