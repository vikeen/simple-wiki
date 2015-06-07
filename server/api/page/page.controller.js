'use strict';

var _ = require('lodash'),
  marked = require('marked'),
  sha1 = require('node-sha1'),
  fs = require('fs'),
  path = require('path');

module.exports = {
  create: create,
  index: index,
  show: show,
  update: update
};

/*
 * Public API
 */

function create(req, res) {
  var page = {
    readableTitle: req.body.title,
    content: req.body.content,
    contentType: req.body.contentType || 'markdown',
    title: req.body.title.toLowerCase(),
    created: new Date(),
    updated: null
  };

  page.title = _normalizePageTitle(page.title);

  if (page.contentType === 'markdown') {
    page.compiledContent = marked(page.content);
  } else {
    _handleError('ERROR_UNSUPPORTED_CONTENT_TYPE');
    return res.send(500);
  }

  fs.readdir(req.simpleWiki.pagePath, function (err, files) {
    if (err) {
      _handleError(err, 'ERROR_PAGE_DIRECTORY');
      return res.send(500);
    }

    if (files.indexOf(sha1(page.title) + '.json') >= 0) {
      _handleError(err, 'ERROR_PAGE_ALREADY_EXISTS');
      return res.status(500).json({
        error: 'ERROR_PAGE_ALREADY_EXISTS'
      });
    } else {
      var filePath = _getPageFilePath(req.simpleWiki.pagePath, page.title),
        fileData = JSON.stringify(page);

      fs.writeFile(filePath, fileData, 'utf-8', function (err) {
        if (err) {
          _handleError(err, 'ERROR_PAGE_CREATION');
          res.send(500);
        } else {
          res.send(200);
        }
      })
    }
  });
}

function index(req, res) {
  var ret = [];
  fs.readdir(req.simpleWiki.pagePath, function (err, files) {
    if (err) {
      _handleError(err, 'ERROR_PAGE_DIRECTORY');
      return res.status(500);
    }

    var count = 0;
    files.forEach(function (fileName) {
      count++;

      fs.readFile(path.join(req.simpleWiki.pagePath, fileName), 'utf-8', function (err, data) {
        if (err) {
          _handleError(err, 'ERROR_PAGE');
          return res.send(500);
        }


        ret.push(JSON.parse(data));

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
      _handleError(err, 'ERROR_PAGE');
      return res.send(500);
    }

    data = JSON.parse(data);
    data.compiledContent = marked(data.content);
    return res.send(data);
  });
}

function update(req, res) {
  fs.readdir(req.simpleWiki.pagePath, function (err, files) {
    if (err) {
      _handleError(err, 'ERROR_PAGE_DIRECTORY');
      return res.send(500);
    }

    if (files.indexOf(sha1(req.params.title) + '.json') === -1) {
      _handleError(err, 'ERROR_PAGE_DOES_NOT_EXIST');
      return res.status(500).json({
        error: 'ERROR_PAGE_DOES_NOT_EXIST'
      });
    } else {
      var page = {
        readableTitle: req.body.title,
        content: req.body.content,
        contentType: req.body.contentType || 'markdown',
        title: _normalizePageTitle(req.body.readableTitle),
        updated: new Date()
      };

      if (page.contentType === 'markdown') {
        page.compiledContent = marked(page.content);
      } else {
        _handleError('ERROR_UNSUPPORTED_CONTENT_TYPE');
        return res.send(500);
      }

      var filePath = _getPageFilePath(req.simpleWiki.pagePath, page.title);

      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
          _handleError(err, 'ERROR_READING_PAGE');
          return res.send(500);
        }

        data = JSON.parse(data);
        data = _.merge(data, page);

        fs.writeFile(filePath, JSON.stringify(data), 'utf-8', function (err) {
          if (err) {
            _handleError(err, 'ERROR_UPDATING_PAGE');
            res.send(500);
          } else {
            res.send(data);
          }
        });
      });
    }
  });
}

/*
 * Private API
 */

function _getPageFilePath(base, name, fileType) {
  fileType = fileType || 'json';
  var fileName = sha1(name) + '.' + fileType;
  return path.join(base, fileName);
}

function _handleError(error, message) {
  if (message) {
    console.error(message);
  }
  if (error) {
    console.error(error);
  }
}

function _normalizePageTitle(title) {
  return title
    .toLowerCase()
    .replace(/ /g, '_');
}
