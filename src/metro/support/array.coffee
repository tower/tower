class ArrayExtension
  @extract_args: (args) ->
    Array.prototype.slice.call(args, 0, args.length)
    
  @args_options_and_callback: ->
    args = Array.prototype.slice.call(arguments)
    last = args.length - 1
    if typeof args[last] == "function"
      callback = args[last]
      if args.length >= 3
        if typeof args[last - 1] == "object"
          options = args[last - 1]
          args = args[0..last - 2]
        else
          options = {}
          args = args[0..last - 1]
      else
        options = {}
    else if args.length >= 2 && typeof(args[last]) == "object"
      args      = args[0..last - 1]
      options   = args[last]
      callback  = null
    else
      options   = {}
      callback  = null
    
    [args, options, callback]
    
  
module.exports = ArrayExtension
