(function() {
  var Support;
  Support = {
    Class: require('./support/class'),
    Logger: require('./support/logger'),
    File: require('./support/file'),
    String: require('./support/string'),
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
    }
  };
  module.exports = Support;
}).call(this);
