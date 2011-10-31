Metro.Support.RegExp =
  escape: (string) ->
    string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    
  escapeEach: ->
    result = []
    args   = arguments[0]
    for item, i in args
      result[i] = @escape(item)
    result
    
module.exports = Metro.Support.RegExp
