
Tower.Support.RegExp = {
  regexpEscape: function(string) {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  },
  regexpUnion: function() {}
};

module.exports = Tower.Support.RegExp;
