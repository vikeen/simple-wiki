'use strict';

var _ = require('lodash'),
  marked = require('marked'),
  Promise = require('bluebird'),
  sha1 = require('node-sha1'),
  uuid = require('node-uuid'),
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

function create(payload, options) {
  return new Promise(function (resolve, reject) {

    var page = {
      readableTitle: payload.readableTitle,
      content: payload.content,
      contentType: payload.contentType,
      title: _normalizePageTitle(payload.readableTitle),
      id: uuid.v4(),
      created: new Date(),
      updated: null
    };

    if (page.contentType === 'markdown') {
      page.compiledContent = marked(page.content);
    } else {
      _handleError('ERROR_UNSUPPORTED_CONTENT_TYPE');
      return reject('ERROR_UNSUPPORTED_CONTENT_TYPE');
    }

    _pageExists(options.pagePath, page.id, function (err, exists) {
      if (err) {
        _handleError(err, 'ERROR_PERFORMING_FILE_LOOKUP');
        return reject('ERROR_PERFORMING_FILE_LOOKUP');
      }

      if (exists) {
        _handleError(null, 'ERROR_PAGE_ALREADY_EXISTS');
        return reject('ERROR_PAGE_ALREADY_EXISTS');
      }

      var filePath = _buildFilePath(options.pagePath, page.id);
      _writePage(filePath, JSON.stringify(page), function (err, success) {
        if (err) {
          return reject(err);
        }

        return resolve(page);
      });
    });
  });
}

function index(options) {
  return new Promise(function (resolve, reject) {
    var ret = [];
    fs.readdir(options.pagePath, function (err, files) {
      if (err) {
        _handleError(err, 'ERROR_PERFORMING_PAGE_DIRECTORY_LOOKUP');
        return reject('ERROR_PERFORMING_PAGE_DIRECTORY_LOOKUP');
      }

      var count = 0;
      files.forEach(function (fileName) {
        count++;

        _readPage(path.join(options.pagePath, fileName), function (err, data) {
          if (err) {
            _handleError(err, 'ERROR_READING_FROM_PAGE');
            return reject('ERROR_READING_FROM_PAGE');
          }

          ret.push(JSON.parse(data));

          if (0 === --count) {
            return resolve(ret);
          }
        });
      });
    });
  });
}

function show(id, options) {
  return new Promise(function (resolve, reject) {
    fs.readFile(_buildFilePath(options.pagePath, id), 'utf8', function (err, data) {
      if (err) {
        _handleError(err, 'ERROR_READING_FROM_PAGE');
        return reject('ERROR_READING_FROM_PAGE');
      }

      return resolve(JSON.parse(data));
    });
  });
}

function update(id, payload, options) {
  return new Promise(function (resolve, reject) {
    var page = {
      readableTitle: payload.readableTitle,
      content: payload.content,
      contentType: payload.contentType,
      title: _normalizePageTitle(payload.readableTitle),
      updated: new Date()
    };

    _pageExists(options.pagePath, id, function (err, exists) {
      if (err || !exists) {
        _handleError(err, 'ERROR_PERFORMING_FILE_LOOKUP');
        return reject('ERROR_PERFORMING_FILE_LOOKUP');
      }

      if (page.contentType === 'markdown') {
        page.compiledContent = marked(page.content);
      } else {
        _handleError(null, 'ERROR_UNSUPPORTED_CONTENT_TYPE');
        return reject('ERROR_UNSUPPORTED_CONTENT_TYPE');
      }

      var filePath = _buildFilePath(options.pagePath, id);

      _readPage(filePath, function (err, data) {
        if (err) {
          return reject(err);
        }

        data = JSON.parse(data);
        data = _.merge(data, page);

        _writePage(filePath, JSON.stringify(data), function (err, success) {
          if (err) {
            return reject(err);
          }

          return resolve(data);
        });

      });
    });
  });
}

/*
 * Private API
 */

function _buildFilePath(base, id) {
  return path.join(base, id + '.json' );
}

function _handleError(error, message) {
  if (process.env.NODE_ENV !== 'test') {
    if (message) {
      console.error(message);
    }
    if (error) {
      console.error(error);
    }
  }
}

function _pageExists(path, id, callback) {
  fs.readdir(path, function (err, files) {
    if (err) {
      return callback(err, null);
    }

    if (files.indexOf(id + '.json') >= 0) {
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
