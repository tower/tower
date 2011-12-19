Coach.Support.RegExp =
  regexpEscape: (string) ->
    string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    
module.exports = Coach.Support.RegExp
