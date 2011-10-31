Metro.Support.RegExp = {
  escape: function(string) {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  },
  escapeEach: function() {
    var args, i, item, result, _len;
    result = [];
    args = arguments[0];
    for (i = 0, _len = args.length; i < _len; i++) {
      item = args[i];
      result[i] = this.escape(item);
    }
    return result;
  }
};
module.exports = Metro.Support.RegExp;