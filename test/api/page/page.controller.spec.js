"use strict";

var should = require('should'),
  _ = require('lodash'),
  fs = require('fs'),
  sha1 = require('node-sha1'),
  path = require('path'),
  testHelpers = require('../../helpers'),
  pageController = require(path.join(testHelpers.config.root, 'server/api/page/page.controller'));

describe('API Page Controller', function () {
  var page = {},
    options = {};

  before(function (done) {
    testHelpers.init(function() {
      done();
    });
  });

  beforeEach(function (done) {
    page = {
      readableTitle: 'My readable title',
      content: '#Markdown Content',
      contentType: 'markdown',
      title: 'My readable title'
    };
    options = {
      pagePath: testHelpers.config.test.pages
    };
    testHelpers.clean(function () {
      done();
    });
  });

  afterEach(function (done) {
    testHelpers.clean(function () {
      done();
    });
  });

  describe('create method', function () {
    it('should create a valid page', function (done) {
      pageController.create(page, options).then(function (data) {
        data.should.have.property('readableTitle', 'My readable title');
        data.should.have.property('title', 'my_readable_title');
        data.should.have.property('id');
        data.should.have.property('compiledContent');
        data.should.have.property('created');
        data.should.have.property('updated', null);

        var filePath = path.join(testHelpers.config.test.pages, data.id + '.json');
        fs.readFile(filePath, 'utf-8', function (err, fileData) {
          should.not.exist(err);
          fileData.should.be.equal(JSON.stringify(data));
          done();
        });
      });
    });

    it('should fail from an invalid content type', function (done) {
      page.contentType = 'unsupport content type';
      pageController.create(page, options)
        .catch(function (err) {
          err.should.be.equal('ERROR_UNSUPPORTED_CONTENT_TYPE');
          done();
        });
    });

    it('should fail from an invalid page path', function (done) {
      options.pagePath = 'invalid';
      pageController.create(page, options).catch(function (err) {
        err.should.be.equal('ERROR_PERFORMING_FILE_LOOKUP');
        done();
      });
    });

    it('should have a views meta data attribute', function (done) {
      pageController.create(page, options).then(function (newPage) {
        newPage.should.have.property('views', 0);
        done();
      });
    });

  });

  describe('index method', function () {
    it('should give back all pages', function (done) {
      pageController.create(page, options).then(function (newPage) {
        pageController.index(options).then(function (data) {
          data.should.have.lengthOf(1);
          data[0].should.have.property('readableTitle', 'My readable title');
          data[0].should.have.property('title', 'my_readable_title');
          done();
        });
      });
    });

    it('should fail from an invalid page path', function (done) {
      options.pagePath = 'invalid';
      pageController.index(options).catch(function (err) {
        err.should.be.equal('ERROR_PERFORMING_PAGE_DIRECTORY_LOOKUP');
        done();
      });
    });

    describe('meta data', function () {
      it('should provide a default view count of 0', function (done) {
        pageController.create(page, options).then(function (newPage) {
          delete newPage.views;
          newPage.should.not.have.property('views');

          var filePath = path.join(testHelpers.config.test.pages, newPage.id + '.json');
          fs.writeFile(filePath, JSON.stringify(newPage), 'utf-8', function (err) {
            should.not.exist(err);
            pageController.index(options).then(function (pages) {
              pages.should.have.lengthOf(1);
              pages[0].should.have.property('id', newPage.id);
              pages[0].should.have.property('views', 0);
              done();
            });
          });
        });
      });
    });
  });

  describe('show method', function () {
    it('should give back the page', function (done) {
      pageController.create(page, options).then(function (newPage) {
        newPage.should.have.property('views', 0);

        pageController.show(newPage.id, options).then(function (data) {
          data.should.have.property('id', newPage.id);
          data.should.have.property('readableTitle', 'My readable title');
          data.should.have.property('title', 'my_readable_title');
          done();
        });
      });
    });

    it('should fail from an invalid page path', function (done) {
      pageController.create(page, options).then(function (newPage) {
        options.pagePath = 'invalid';
        pageController.show(newPage.title, options).catch(function (err) {
          err.should.be.equal('ERROR_READING_FROM_PAGE');
          done();
        });
      });
    });

    describe('meta data', function () {
      it('should update views', function (done) {
        pageController.create(page, options).then(function (newPage) {
          newPage.should.have.property('views', 0);
          pageController.show(newPage.id, options).then(function (data) {
            data.should.have.property('id', newPage.id);
            data.should.have.property('views', 1);
            pageController.show(newPage.id, options).then(function (data) {
              data.should.have.property('id', newPage.id);
              data.should.have.property('views', 2);
              done();
            });
          });
        });
      });

      it('should update the views if it does not exist', function (done) {
        pageController.create(page, options).then(function (newPage) {
          delete newPage.views;
          newPage.should.not.have.property('views');

          var filePath = path.join(testHelpers.config.test.pages, newPage.id + '.json');
          fs.writeFile(filePath, JSON.stringify(newPage), 'utf-8', function (err) {
            should.not.exist(err);
            pageController.show(newPage.id, options).then(function (shownPage) {
              shownPage.should.have.property('id', newPage.id);
              shownPage.should.have.property('views', 1);
              done();
            });
          });
        });
      });
    });
  });

  describe('update method', function () {
    it('should fail from an invalid page path', function (done) {
      pageController.create(page, options).then(function (newPage) {
        options.pagePath = 'invalid';
        pageController.update(newPage.title, newPage, options).catch(function (err) {
          err.should.be.equal('ERROR_PERFORMING_FILE_LOOKUP');
          done();
        });
      });
    });

    it('should fail from an invalid content type', function (done) {
      pageController.create(page, options).then(function (newPage) {
        newPage.contentType = 'invalid';
        pageController.update(newPage.id, newPage, options).catch(function (err) {
          err.should.be.equal('ERROR_UNSUPPORTED_CONTENT_TYPE');
          done();
        });
      });
    });

    it('should update a page', function (done) {
      pageController.create(page, options).then(function (newPage) {
        newPage.readableTitle = 'ASD LKJ MVN';
        pageController.update(newPage.id, newPage, options).then(function (updatedPage) {
          updatedPage.should.have.property('readableTitle', 'ASD LKJ MVN');
          updatedPage.should.have.property('title', 'asd_lkj_mvn');
          should.exist(updatedPage.updated);
          updatedPage.created.should.not.equal(updatedPage.updated);
          done();
        });
      });
    });
  });
});
