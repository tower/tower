(function() {
  var Metro;
  require('./metro/support');
  Metro = (function() {
    function Metro() {}
    Metro.autoload('Asset', './metro/asset');
    Metro.autoload('Application', './metro/application');
    Metro.autoload('Route', './metro/route');
    Metro.autoload('./metro/model');
    Metro.autoload('./metro/view');
    Metro.autoload('./metro/controller');
    Metro.autoload('./metro/presenter');
    Metro.autoload('./metro/middleware');
    Metro.autoload('./metro/command');
    Metro.autoload('./metro/generator');
    Metro.autoload('./metro/spec');
    return Metro;
  })();
  module.exports = global.Metro = Metro;
}).call(this);
