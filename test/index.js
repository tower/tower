
if ('undefined' === typeof window) {
  var tower = require('..');
  var assert = require('assert');
} else {
  var tower = require('tower');
  var assert = require('timoxley-assert');
}

describe('tower', function(){
  it('should be at 0.5.0', function(){
    assert('0.5.0' === tower.version);
  });
});