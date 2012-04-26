
Tower.Support.RegExp = {
  regexpEscape: function(string) {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
};

module.exports = Tower.Support.RegExp;
