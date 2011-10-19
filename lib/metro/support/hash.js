(function() {
  var Hash;
  Hash = (function() {
    function Hash() {}
    Hash.extract_options = function(args) {
      if (args && Metro.Support.Object.is_hash(args[args.length - 1])) {
        return Array.prototype.pop.call(args);
      } else {
        return {};
      }
    };
    return Hash;
  })();
  module.exports = Hash;
}).call(this);
