class Hash
  @extract_options: (args) ->
    if args && Metro.Support.Object.is_hash(args[args.length - 1])
      Array.prototype.pop.call(args)
    else
      {}
  
module.exports = Hash
