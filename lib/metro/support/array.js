(function() {
  var Array;
  Array = (function() {
    function Array() {}
    Array.extract_args = function(args) {
      return Array.prototype.slice.call(args, 0, args.length);
    };
    return Array;
  })();
  module.exports = Array;
}).call(this);
