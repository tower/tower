Tower.Support.RegExp =
  regexpEscape: (string) ->
    string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")

module.exports = Tower.Support.RegExp
