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
    return res.status(500);
  }

  _pageExists(req.simpleWiki.pagePath, page.title, function (err, exists) {
    if (err) {
      _handleError(err, 'ERROR_PERFORMING_FILE_LOOKUP');
      return res.status(500).json({
        error: 'ERROR_PERFORMING_FILE_LOOKUP'
      });
    }

    if (exists) {
      _handleError(null, 'ERROR_PAGE_ALREADY_EXISTS');
      return res.status(500).json({
        error: 'ERROR_PAGE_ALREADY_EXISTS'
      });
    }

    var filePath = _buildFilePath(req.simpleWiki.pagePath, page.title);
    _writePage(filePath, JSON.stringify(page), function (err, success) {
      if (err) {
        return res.status(500).json({
          error: err
        });
      }

      return res.status(200).json(page);
    });
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

      _readPage(path.join(req.simpleWiki.pagePath, fileName), function (err, data) {
        if (err) {
          return res.send(500).json({
            error: 'ERROR_READING_FROM_PAGE'
          });
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
  fs.readFile(_buildFilePath(req.simpleWiki.pagePath, _normalizePageTitle(req.params.title)), 'utf8', function (err, data) {
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
  var page = {
    readableTitle: req.body.title,
    content: req.body.content,
    contentType: req.body.contentType || 'markdown',
    title: _normalizePageTitle(req.body.readableTitle),
    updated: new Date()
  };

  _pageExists(req.simpleWiki.pagePath, page.title, function (err, exists) {
    if (err || !exists) {
      _handleError(err, 'ERROR_PERFORMING_FILE_LOOKUP');
      return res.status(500).json({
        error: 'ERROR_PERFORMING_FILE_LOOKUP'
      });
    }

    if (page.contentType === 'markdown') {
      page.compiledContent = marked(page.content);
    } else {
      _handleError(null, 'ERROR_UNSUPPORTED_CONTENT_TYPE');
      return res.send(500);
    }

    var filePath = _buildFilePath(req.simpleWiki.pagePath, page.title);

    _readPage(filePath, function (err, data) {
      if (err) {
        return res.send(500).json({
          error: 'ERROR_READING_FROM_PAGE'
        });
      }

      data = JSON.parse(data);
      data = _.merge(data, page);

      _writePage(filePath, JSON.stringify(data), function (err, success) {
        if (err) {
          return res.status(500).json({
            error: err
          });
        }

        return res.status(200).json(data);
      });

    });
  });
}

/*
 * Private API
 */

function _buildFileName(title, fileType) {
  fileType = fileType || '.json';
  return sha1(_normalizePageTitle(title)) + fileType;
}

function _buildFilePath(base, name, fileType) {
  fileType = fileType || 'json';
  return path.join(base, _buildFileName(name));
}

function _handleError(error, message) {
  if (message) {
    console.error(message);
  }
  if (error) {
    console.error(error);
  }
}

function _pageExists(path, name, callback) {
  fs.readdir(path, function (err, files) {
    if (err) {
      return callback(err, null);
    }

    if (files.indexOf(sha1(name) + '.json') >= 0) {
      return callback(null, true);
    }

    return callback(null, false);
  })
}

function _normalizePageTitle(title) {
  return title
    .toLowerCase()
    .replace(/ /g, '_');
}

function _readPage(file, callback) {
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      _handleError(err, 'ERROR_READING_FROM_PAGE');
      return callback('ERROR_READING_FROM_PAGE', false);
    }

    return callback(null, data);
  });
}

function _writePage(file, data, callback) {
  fs.writeFile(file, data, 'utf-8', function (err) {
    if (err) {
      _handleError(err, 'ERROR_WRITING_PAGE');
      return callback('ERROR_WRITING_PAGE', false);
    }
    return callback(null, true);
  });
}
