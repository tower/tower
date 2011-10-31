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
  RegExp: require('./support/regexp'),
  Time: require('./support/time'),
  agent: typeof window !== 'undefined' ? navigator.userAgent : 'node',
  isInt: function(n) {
    return n === +n && n === (n | 0);
  },
  isFloat: function(n) {
    return n === +n && n !== (n | 0);
  },
  isPresent: function(object) {
    var key, value;
    for (key in object) {
      value = object[key];
      return true;
    }
    return false;
  },
  isBlank: function(object) {
    var key, value;
    for (key in object) {
      value = object[key];
      return false;
    }
    return true;
  }
};
module.exports = Support;