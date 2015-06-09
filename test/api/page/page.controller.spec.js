"use strict";

var should = require('should'),
  _ = require('lodash'),
  fs = require('fs'),
  sha1 = require('node-sha1'),
  path = require('path'),
  helpers = require('../../helpers'),
  pageController = require(path.join(helpers.config.root, 'server/api/page/page.controller'));

describe('API Page Controller', function () {
  var page = {},
    options = {};

  before(function (done) {
    done();
  });

  beforeEach(function (done) {
    page = {
      readableTitle: 'My readable title',
      content: '#Markdown Content',
      contentType: 'markdown',
      title: 'My readable title'
    };
    options = {
      pagePath: helpers.config.test.pages
    };
    helpers.clean(function () {
      done();
    });
  });

  after(function (done) {
    helpers.clean(function () {
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

        var filePath = path.join(helpers.config.test.pages, data.id + '.json');
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

    //it('should fail from a duplicate page', function (done) {
    //  pageController.create(page, options).then(function (newPage) {
    //    should.exist(newPage);
    //    pageController.create(page, options).catch(function (err) {
    //      err.should.be.equal('ERROR_PAGE_ALREADY_EXISTS');
    //      done();
    //    });
    //  });
    //});
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
  });

  describe('show method', function () {
    it('should give back the page', function (done) {
      pageController.create(page, options).then(function (newPage) {
        pageController.show(newPage.id, options).then(function (data) {
          JSON.stringify(newPage).should.be.equal(JSON.stringify(data));
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
