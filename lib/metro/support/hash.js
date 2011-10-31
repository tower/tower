var Hash;
Hash = (function() {
  function Hash() {}
  Hash.extractOptions = function(args) {
    if (args && Metro.Support.Object.isHash(args[args.length - 1])) {
      return Array.prototype.pop.call(args);
    } else {
      return {};
    }
  };
  return Hash;
})();
module.exports = Hash;