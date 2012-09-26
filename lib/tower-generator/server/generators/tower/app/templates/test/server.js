require('tower');

global.chai = require('chai');
global.assert = chai.assert;
global.expect = chai.expect;
global.sinon = require('sinon');
global.async = require('async');
global.test = it;
global.cb = true;

global.factory = function() {
  var _ref;
  return (_ref = Tower.Factory).create.apply(_ref, arguments);
};

global.urlFor = Tower.urlFor;
global.get = _.get;
global.post = _.post;
global.put = _.put;
global.destroy = _.destroy;

global.app = Tower.Application.instance();

before(function(done) {
  return app.initialize(done);
});

beforeEach(function(done) {
  if (Tower.isClient) {
    return Tower.StoreMemory.clean(done);
  } else {
    return Tower.StoreMongodb.clean(done);
  }
});
