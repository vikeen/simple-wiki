"use strict";

var should = require('should'),
  _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  sha1 = require('node-sha1'),
  testHelpers = require('../../helpers'),
  config = require('../../../config')('test'),
  pageController = require(path.join(config.root, 'server/api/page/page.controller'));

describe('API Page Controller', function () {
  var page = {},
    options = {};

  before(function (done) {
    testHelpers.init(function () {
      done();
    });
  });

  beforeEach(function (done) {
    page = {
      readableTitle: 'My readable title',
      content: '#Markdown Content',
      contentType: 'markdown'
    };
    options = {
      pagePath: config.pagePath
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
    it('create a valid page', function (done) {
      pageController.create(page, options).then(function (data) {
        data.should.have.property('readableTitle', 'My readable title');
        data.should.have.property('title', 'my_readable_title');
        data.should.have.property('id');
        data.should.have.property('compiledContent');
        data.should.have.property('created');
        data.should.have.property('updated', null);

        var filePath = path.join(config.pagePath, sha1(data.title) + '.' + data.id + '.json');
        fs.readFile(filePath, 'utf-8', function (err, fileData) {
          should.not.exist(err);
          fileData.should.be.equal(JSON.stringify(data));
          done();
        });
      });
    });

    it('fail from an invalid content type', function (done) {
      page.contentType = 'unsupport content type';
      pageController.create(page, options)
        .catch(function (err) {
          err.should.be.equal('ERROR_UNSUPPORTED_CONTENT_TYPE');
          done();
        });
    });

    it('fail from an invalid page path', function (done) {
      options.pagePath = 'invalid';
      pageController.create(page, options).catch(function (err) {
        err.should.be.equal('ERROR_PERFORMING_FILE_LOOKUP');
        done();
      });
    });

    it('have a views meta data attribute', function (done) {
      pageController.create(page, options).then(function (newPage) {
        newPage.should.have.property('views', 0);
        done();
      });
    });

    it('fail from a duplicate page', function (done) {
      pageController.create(page, options).then(function (newPage) {
        should.exist(newPage);
        pageController.create(page, options).catch(function (err) {
          err.should.be.equal('ERROR_PAGE_ALREADY_EXISTS');
          done();
        });
      });
    });

    describe('normalize the page correctly', function (done) {
      it('lowercase the page title', function (done) {
        page.readableTitle = 'UPPERCASE';
        pageController.create(page, options).then(function (newPage) {
          newPage.should.have.property('title', 'uppercase');
          done();
        });
      });

      it('trim whitespace', function (done) {
        page.readableTitle = '    lowercase   ';
        pageController.create(page, options).then(function (newPage) {
          newPage.should.have.property('title', 'lowercase');
          done();
        });
      });

      it('replace non alphanumeric or space characters', function (done) {
        page.readableTitle = '<>{}[]:;!@#$%^&*()_+TITLE<>{}[]:;!@#$%^&*()_+';
        pageController.create(page, options).then(function (newPage) {
          newPage.should.have.property('title', 'title');
          done();
        });
      });

      it('replace internal space characters with underscores', function (done) {
        page.readableTitle = 'this is a new title';
        pageController.create(page, options).then(function (newPage) {
          newPage.should.have.property('title', 'this_is_a_new_title');
          done();
        });
      });
    });
  });

  describe('index method', function () {
    it('give back all pages', function (done) {
      pageController.create(page, options).then(function (newPage) {
        pageController.index(options).then(function (data) {
          data.should.have.lengthOf(1);
          data[0].should.have.property('readableTitle', 'My readable title');
          data[0].should.have.property('title', 'my_readable_title');
          done();
        });
      });
    });

    it('fail from an invalid page path', function (done) {
      options.pagePath = 'invalid';
      pageController.index(options).catch(function (err) {
        err.should.be.equal('ERROR_PERFORMING_PAGE_DIRECTORY_LOOKUP');
        done();
      });
    });

    describe('meta data', function () {
      it('provide a default view count of 0', function (done) {
        pageController.create(page, options).then(function (newPage) {
          delete newPage.views;
          newPage.should.not.have.property('views');

          var filePath = path.join(config.pagePath, sha1(newPage.title) + '.' + newPage.id + '.json');
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
    it('give back the page', function (done) {
      pageController.create(page, options).then(function (newPage) {
        newPage.should.have.property('views', 0);

        pageController.show(newPage.title, options).then(function (data) {
          data.should.have.property('id', newPage.id);
          data.should.have.property('readableTitle', 'My readable title');
          data.should.have.property('title', 'my_readable_title');
          done();
        });
      });
    });

    it('fail from an invalid page path', function (done) {
      pageController.create(page, options).then(function (newPage) {
        options.pagePath = 'invalid';
        pageController.show(newPage.title, options).catch(function (err) {
          err.should.be.equal('ERROR_READING_FROM_PAGE');
          done();
        });
      });
    });

    describe('meta data', function () {
      it('update views', function (done) {
        pageController.create(page, options).then(function (newPage) {
          newPage.should.have.property('views', 0);
          pageController.show(newPage.title, options).then(function (data) {
            data.should.have.property('id', newPage.id);
            data.should.have.property('views', 1);
            pageController.show(newPage.title, options).then(function (data) {
              data.should.have.property('id', newPage.id);
              data.should.have.property('views', 2);
              done();
            });
          });
        });
      });

      it('update the views if it does not exist', function (done) {
        pageController.create(page, options).then(function (newPage) {
          delete newPage.views;
          newPage.should.not.have.property('views');

          var filePath = path.join(config.pagePath, sha1(newPage.title) + '.' + newPage.id + '.json');
          fs.writeFile(filePath, JSON.stringify(newPage), 'utf-8', function (err) {
            should.not.exist(err);
            pageController.show(newPage.title, options).then(function (shownPage) {
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
    before(function (done) {
      testHelpers.init(function () {
        done();
      });
    });

    beforeEach(function (done) {
      testHelpers.clean(function () {
        pageController.create(page, options).then(function (newPage) {
          page = newPage;
          done();
        });
      });
    });

    afterEach(function (done) {
      testHelpers.clean(function () {
        done();
      });
    });

    it('fail from an invalid page path', function (done) {
      options.pagePath = 'invalid';
      pageController.update(page.title, page, options).catch(function (err) {
        err.should.be.equal('ERROR_PERFORMING_FILE_LOOKUP');
        done();
      });
    });

    it('fail from an invalid content type', function (done) {
      page.contentType = 'invalid';
      pageController.update(page.title, page, options).catch(function (err) {
        err.should.be.equal('ERROR_UNSUPPORTED_CONTENT_TYPE');
        done();
      });
    });

    it('update a page', function (done) {
      page.readableTitle = 'ASD LKJ MVN';
      pageController.update(page.title, page, options).then(function (updatedPage) {
        updatedPage.should.have.property('readableTitle', 'ASD LKJ MVN');
        updatedPage.should.have.property('title', 'asd_lkj_mvn');
        should.exist(updatedPage.updated);
        updatedPage.created.should.not.equal(updatedPage.updated);
        done();
      });
    });

    describe('normalize the page correctly', function (done) {
      it('lowercase the page title', function (done) {
        page.readableTitle = 'UPPERCASE';
        pageController.update(page.title, page, options).then(function (newPage) {
          newPage.should.have.property('title', 'uppercase');
          done();
        });
      });

      it('trim whitespace', function (done) {
        page.readableTitle = '    lowercase   ';
        pageController.update(page.title, page, options).then(function (newPage) {
          newPage.should.have.property('title', 'lowercase');
          done();
        });
      });

      it('replace non alphanumeric or space characters', function (done) {
        page.readableTitle = '<>{}[]:;!@#$%^&*()_+TITLE<>{}[]:;!@#$%^&*()_+';
        pageController.update(page.title, page, options).then(function (newPage) {
          newPage.should.have.property('title', 'title');
          done();
        });
      });

      it('replace internal space characters with underscores', function (done) {
        page.readableTitle = 'this is a new title';
        pageController.update(page.title, page, options).then(function (newPage) {
          newPage.should.have.property('title', 'this_is_a_new_title');
          done();
        });
      });
    });
  });
});
