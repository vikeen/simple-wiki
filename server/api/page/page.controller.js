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
      updated: null,
      views: 0
    };

    if (page.contentType === 'markdown') {
      page.compiledContent = marked(page.content);
    } else {
      _handleError('ERROR_UNSUPPORTED_CONTENT_TYPE');
      return reject('ERROR_UNSUPPORTED_CONTENT_TYPE');
    }

    _pageExists(options.pagePath, {
      title: page.title
  }, function (err, exists) {
      if (err) {
        _handleError(err, 'ERROR_PERFORMING_FILE_LOOKUP');
        return reject('ERROR_PERFORMING_FILE_LOOKUP');
      }

      if (exists) {
        _handleError('ERROR_PAGE_ALREADY_EXISTS');
        return reject('ERROR_PAGE_ALREADY_EXISTS');
      }

      var fileName = _buildFileName(page.title, page.id),
        filePath = _buildFilePath(options.pagePath, fileName);

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

          data = JSON.parse(data);
          data.views = data.views || 0;

          ret.push(data);

          if (0 === --count) {
            return resolve(ret);
          }
        });
      });
    });
  });
}

function show(title, options) {
  return new Promise(function (resolve, reject) {
    fs.readFile(_buildFilePath(options.pagePath, title), 'utf8', function (err, data) {
      if (err) {
        _handleError(err, 'ERROR_READING_FROM_PAGE');
        return reject('ERROR_READING_FROM_PAGE');
      }

      data = JSON.parse(data);
      data.views = data.views ? data.views += 1 : 1;

      var filePath = _buildFilePath(options.pagePath, title);
      _writePage(filePath, JSON.stringify(data), function (err, success) {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  });
}

function update(title, payload, options) {
  return new Promise(function (resolve, reject) {
    var page = {
      id: payload.id,
      readableTitle: payload.readableTitle,
      content: payload.content,
      contentType: payload.contentType,
      title: _normalizePageTitle(payload.readableTitle),
      updated: new Date()
    };

    _pageExists(options.pagePath, title, function (err, exists) {
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

      var filePath = _buildFilePath(options.pagePath, title);

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

function _buildFileName(title, id) {
  return [sha1(title), id, 'json'].join('.');
}

function _buildFilePath(base, fileName) {
  return path.join(base, fileName);
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

/*
 * @param filter {Object} - Parts of the file to search for
 */
function _pageExists(path, filter, callback) {
  fs.readdir(path, function (err, files) {
    if (err) {
      return callback(err, null);
    }

    var files = _.some(files, function(file) {
      if (files.indexOf(title + '.json') >= 0) {
        console.log(file);
        return true;
      }
    });

      //return callback(null, true);

    //return callback(null, false);
  })
}

function _normalizePageTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^0-9a-zA-Z ]/g, '')
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
