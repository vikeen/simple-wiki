var path = require('path'),
  should = require('should'),
  _ = require('lodash'),
  testHelpers = require('../helpers'),
  originalProductionConfig = require('../../dist/');

describe('Configuration', function () {
  var productionConfig = {};

  before(function (done) {
    testHelpers.init(function () {
      done();
    });
  });

  beforeEach(function (done) {
    productionConfig = _.cloneDeep(originalProductionConfig);
    testHelpers.clean(function () {
      done();
    });
  });

  afterEach(function (done) {
    testHelpers.clean(function () {
      done();
    });
  });

  describe('Production Environment', function () {
    describe('methods', function () {
      describe('start', function () {
        it('should have a start method', function (done) {
          _.isFunction(productionConfig.server.start).should.be.true;
          done();
        });

        it('should fail without required parameters', function (done) {
          try {
            productionConfig.pagePath = undefined;
            productionConfig.server.start();
          } catch (e) {
            should.exist(e);
            e.should.be.equal('Missing required configuration: pagePath');
          }
          done();
        })
      });

      describe('info', function () {
        it('should have an info method', function (done) {
          _.isFunction(productionConfig.info).should.be.true;
          done();
        });
      });
    });

    describe('port number', function () {
      it('should have default port number', function (done) {
        productionConfig.server.port.should.be.equal(9000);
        done();
      });

      //it('should support environment port number', function (done) {
      //  process.env.PORT = 'dummy port';
      //  var tempConfig = require('../../dist/');
      //  tempConfig.server.port.should.be.equal('dummy port');
      //  done();
      //});

      it('should support manual override for environment port number', function (done) {
        productionConfig.info().server.port = 9005;
        productionConfig.info().server.port.should.be.equal(9005);
        done();
      });
    });

    describe('ip address', function () {
      it('should have default port number', function (done) {
        productionConfig.server.ip.should.be.equal('127.0.0.1');
        done();
      });

      //it('should support environment port number', function (done) {
      //  process.env.PORT = 'dummy port';
      //  var tempConfig = require('../../dist/');
      //  tempConfig.server.port.should.be.equal('dummy port');
      //  done();
      //});

      it('should support manual override for environment port number', function (done) {
        productionConfig.info().server.ip = 'dummy ip';
        productionConfig.info().server.ip.should.be.equal('dummy ip');
        done();
      });
    });

    describe('paths', function () {
      describe('pages', function () {
        it('should have empty page path', function (done) {
          should.not.exist(productionConfig.pagePath);
          done();
        });

        it('should support manual override for page path', function (done) {
          productionConfig.info().pagePath = 'dummy/path';
          productionConfig.info().pagePath.should.be.equal('dummy/path');
          done();
        });
      });

      describe('favicon', function () {
        it('should have empty favicon path', function (done) {
          should.not.exist(productionConfig.favicon);
          done();
        });

        it('should support manual override for favicon path', function (done) {
          productionConfig.info().faviconPath = 'dummy/path';
          productionConfig.info().faviconPath.should.be.equal('dummy/path');
          done();
        });
      });
    });
  });
});
