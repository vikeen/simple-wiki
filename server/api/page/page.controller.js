'use strict';

var _ = require('lodash'),
  marked = require('marked'),
  sha1 = require('node-sha1'),
  fs = require('fs'),
  path = require('path');

module.exports = {
  create: create,
  index: index,
  show: show
};

function create(req, res) {
  var page = {
    readableTitle: req.body.title,
    content: req.body.content,
    title: req.body.title.toLowerCase(),
    created: new Date(),
    updated: null
  };

  page.title = _normalizePageTitle(page.title);

  var filePath = _getPageFilePath(req.simpleWiki.pagePath, page.title),
    fileData = JSON.stringify(page);

  fs.writeFile(filePath, fileData, 'utf-8', function (err) {
    if (err) {
      console.error('failed to create page:', err);
      res.send(500);
    } else {
      res.send(200);
    }
  })
}

function index(req, res) {
  var ret = [];
  fs.readdir(req.simpleWiki.pagePath, function (err, files) {
    if (err) {
      console.log(err);
      return res.send(500);
    }

    var count = 0;
    files.forEach(function (fileName) {
      count++;

      fs.readFile(path.join(req.simpleWiki.pagePath, fileName), 'utf-8', function (err, data) {
        if (err) {
          console.log(err);
          return res.send(500);
        }

        data = JSON.parse(data);
        data.content = marked(data.content);
        ret.push(data);

        if (0 === --count) {
          return res.json(ret);
        }
      });
    });
  });
}

function show(req, res) {
  fs.readFile(_getPageFilePath(req.simpleWiki.pagePath, _normalizePageTitle(req.params.title)), 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      return res.send(500);
    }

    data = JSON.parse(data);
    data.content = marked(data.content);
    res.send(data);
  });
}

function _normalizePageTitle(title) {
  return title
    .toLowerCase()
    .replace(/ /g, '_');
}

function _getPageFilePath(base, name, fileType) {
  fileType = fileType || 'json';
  var fileName = sha1(name) + '.' + fileType;
  return path.join(base, fileName);
}
