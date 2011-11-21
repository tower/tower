Metro.Support.RegExp =
  regexpEscape: (string) ->
    string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    
module.exports = Metro.Support.RegExp
