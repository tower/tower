(function() {
  var Support;
  Support = {
    Class: require('./support/class'),
    Logger: require('./support/logger'),
    File: require('./support/file'),
    Dependencies: require('./support/dependencies')
  };
  module.exports = Support;
}).call(this);
