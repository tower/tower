(function() {
  Metro.Generator = {};
  require('./generator/dsl');
  require('./generator/application');
  module.exports = Metro.Generator;
}).call(this);
