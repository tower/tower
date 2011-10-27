(function() {
  var Dispatcher;
  Dispatcher = (function() {
    function Dispatcher() {}
    Dispatcher.emit = function(name, options) {
      if (options == null) {
        options = {};
      }
      return Metro.emit(name, this, options);
    };
    Dispatcher.on = function(name, callback) {
      return Metro.on(name, this, callback);
    };
    Dispatcher.prototype.emit = function(name, options) {
      return Metro.emit(name, this.options);
    };
    Dispatcher.prototype.on = function(name, callback) {
      return Metro.on(name, this, callback);
    };
    return Dispatcher;
  })();
}).call(this);
