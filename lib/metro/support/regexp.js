(function() {
  var MetroRegExp;
  MetroRegExp = (function() {
    function MetroRegExp() {}
    MetroRegExp.escape = function(string) {
      return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    MetroRegExp.escape_each = function() {
      var args, i, item, result, _len;
      result = [];
      args = arguments[0];
      for (i = 0, _len = args.length; i < _len; i++) {
        item = args[i];
        result[i] = this.escape(item);
      }
      return result;
    };
    return MetroRegExp;
  })();
  module.exports = MetroRegExp;
}).call(this);
