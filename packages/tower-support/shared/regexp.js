
Tower._.mixin({
  regexpEscape: function(string) {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  },
  regexpUnion: function() {}
});
