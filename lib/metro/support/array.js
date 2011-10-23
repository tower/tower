(function() {
  var ArrayExtension;
  ArrayExtension = (function() {
    function ArrayExtension() {}
    ArrayExtension.extract_args = function(args) {
      return Array.prototype.slice.call(args, 0, args.length);
    };
    ArrayExtension.args_options_and_callback = function() {
      var args, callback, last, options;
      args = Array.prototype.slice.call(arguments);
      last = args.length - 1;
      if (typeof args[last] === "function") {
        callback = args[last];
        if (args.length >= 3) {
          if (typeof args[last - 1] === "object") {
            options = args[last - 1];
            args = args.slice(0, (last - 2 + 1) || 9e9);
          } else {
            options = {};
            args = args.slice(0, (last - 1 + 1) || 9e9);
          }
        } else {
          options = {};
        }
      } else if (args.length >= 2 && typeof args[last] === "object") {
        args = args.slice(0, (last - 1 + 1) || 9e9);
        options = args[last];
        callback = null;
      } else {
        options = {};
        callback = null;
      }
      return [args, options, callback];
    };
    return ArrayExtension;
  })();
  module.exports = ArrayExtension;
}).call(this);
