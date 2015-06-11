var path = require('path'),
  should = require('should'),
  _ = require('lodash'),
  testHelpers = require('../helpers'),
  originalDevelopmentConfig = require('../../config')('development');

describe('Configuration', function () {
  var developmentConfig = {};
  before(function (done) {
    testHelpers.init(function () {
      done();
    });
  });

  beforeEach(function (done) {
    developmentConfig = _.cloneDeep(originalDevelopmentConfig);
    testHelpers.clean(function () {
      done();
    });
  });

  afterEach(function (done) {
    testHelpers.clean(function () {
      done();
    });
  });

  describe('Development Environment', function () {
    describe('port number', function () {
      it('should have default server port', function (done) {
        should(developmentConfig.server.port).be.equal(9000);
        done();
      });
    });

    describe('ip address', function () {
      it('should have default server ip', function (done) {
        should(developmentConfig.server.ip).be.equal('127.0.0.1');
        done();
      });
    });

    describe('paths', function () {
      describe('pages', function () {
        it('should have page path', function (done) {
          should.exist(developmentConfig.pagePath);
          done();
        });
      });

      describe('favicon', function () {
        it('should have empty favicon path', function (done) {
          should.not.exist(developmentConfig.favicon);
          done();
        });
      });
    });
  });
});
