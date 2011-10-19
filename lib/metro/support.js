(function() {
  var Support;
  Support = {
    Class: require('./support/class'),
    Logger: require('./support/logger'),
    Path: require('./support/path'),
    String: require('./support/string'),
    Hash: require('./support/hash'),
    Object: require('./support/object'),
    Array: require('./support/array'),
    Date: require('./support/date'),
    Dependencies: require('./support/dependencies'),
    System: require('./support/system'),
    Lookup: require('./support/lookup'),
    to_ruby: function() {
      var key, value, _ref, _results;
      _ref = Metro.Support.String;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(String.prototype[key] = value);
      }
      return _results;
    },
    to_underscore: function() {
      return require('underscore').extend({}, Metro.Support.String, Metro.Support.Hash, Metro.Support.Array);
    }
  };
  module.exports = Support;
}).call(this);
