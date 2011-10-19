class Array
  @extract_args: (args) ->
    Array.prototype.slice.call(args, 0, args.length)
  
module.exports = Array
  