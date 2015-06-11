var path = require('path'),
  should = require('should'),
  _ = require('lodash'),
  testHelpers = require('../helpers'),
  originalTestConfig = require('../../config')('test');

describe('Configuration', function () {
  var testConfig = {};
  before(function (done) {
    testHelpers.init(function () {
      done();
    });
  });

  beforeEach(function (done) {
    testConfig = _.cloneDeep(originalTestConfig);
    testHelpers.clean(function () {
      done();
    });
  });

  afterEach(function (done) {
    testHelpers.clean(function () {
      done();
    });
  });

  describe('Test Environment', function () {
    describe('port number', function () {
      it('should have default server port', function (done) {
        should(testConfig.server.port).be.equal(9000);
        done();
      });
    });

    describe('ip address', function () {
      it('should have default server ip', function (done) {
        should(testConfig.server.ip).be.equal('127.0.0.1');
        done();
      });
    });

    describe('paths', function () {
      describe('pages', function () {
        it('should have page path', function (done) {
          should.exist(testConfig.pagePath);
          done();
        });
      });

      describe('favicon', function () {
        it('should have empty favicon path', function (done) {
          should.not.exist(testConfig.favicon);
          done();
        });
      });
    });
  });
});
