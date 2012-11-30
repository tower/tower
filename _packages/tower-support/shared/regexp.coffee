Tower._.mixin
  regexpEscape: (string) ->
    string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")

  # @todo http://www.ruby-doc.org/core-1.9.3/Regexp.html#method-c-union
  regexpUnion: ->
