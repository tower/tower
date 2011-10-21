(function() {
  var ArrayExtension;
  ArrayExtension = (function() {
    function ArrayExtension() {}
    ArrayExtension.extract_args = function(args) {
      return Array.prototype.slice.call(args, 0, args.length);
    };
    return ArrayExtension;
  })();
  module.exports = ArrayExtension;
}).call(this);
