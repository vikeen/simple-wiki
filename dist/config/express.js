'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./');

if (!config.pagePath) {
  throw 'config.pagePath is required. Edit the config options to adjust this value'
}

module.exports = function (app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.set('view engine', 'jade');
  app.use(compression());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());

  app.use(function (req, res, next) {
    req.simpleWiki = req.simpleWiki || {};
    req.simpleWiki.pagePath = config.pagePath;
    next();
  });

  var faviconPath = config.faviconPath || path.join(config.root, 'public', 'favicon.ico');
  app.use(favicon(faviconPath));
  app.use(express.static(path.join(config.root, 'public')));
  app.set('appPath', config.root + '/public');
  app.use(morgan('dev'));
};
