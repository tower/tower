(function() {
  var Support;
  Support = {
    Array: require('./support/array'),
    Class: require('./support/class'),
    Callbacks: require('./support/callbacks'),
    Concern: require('./support/concern'),
    Date: require('./support/date'),
    Dependencies: require('./support/dependencies'),
    Hash: require('./support/hash'),
    IE: require('./support/ie'),
    I18n: require('./support/i18n'),
    Inflector: require('./support/inflector'),
    Lookup: require('./support/lookup'),
    Object: require('./support/object'),
    Path: require('./support/path'),
    String: require('./support/string'),
    System: require('./support/system'),
    agent: typeof window !== 'undefined' ? navigator.userAgent : 'node'
  };
  module.exports = Support;
}).call(this);
