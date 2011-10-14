(function() {
  var Logger, exports;
  Logger = (function() {
    var log_level, _i, _len, _ref;
    function Logger() {}
    Logger.FATAL = 0;
    Logger.ERROR = 1;
    Logger.WARN = 2;
    Logger.INFO = 3;
    Logger.DEBUG = 4;
    Logger.prototype.level = Logger.DEBUG;
    Logger.prototype.log = function() {};
    Logger.prototype.format = function(level, date, message) {
      return "" + level + " [" + date + "] " + message;
    };
    _ref = ["fatal", "error", "warn", "info", "debug"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      log_level = _ref[_i];
      Logger.prototype[log_level] = function() {
        var args;
        args = Array.prototype.slice.call(arguments);
        args.unshift(log_level);
        return this.log.apply(this, args);
      };
    }
    return Logger;
  })();
  exports = module.exports = Logger;
}).call(this);
