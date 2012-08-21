Tower.SupportRegExp =
  regexpEscape: (string) ->
    string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")

  # @todo http://www.ruby-doc.org/core-1.9.3/Regexp.html#method-c-union
  regexpUnion: ->

module.exports = Tower.SupportRegExp
