class Hash
  @extractOptions: (args) ->
    if args && Metro.Support.Object.isHash(args[args.length - 1])
      Array.prototype.pop.call(args)
    else
      {}
  
module.exports = Hash
