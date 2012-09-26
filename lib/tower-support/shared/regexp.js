
Tower.SupportRegExp = {
  regexpEscape: function(string) {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  },
  regexpUnion: function() {}
};

module.exports = Tower.SupportRegExp;
