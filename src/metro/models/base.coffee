class Base
  @key: (name, options) ->
    @keys[name] = options
    
  @keys: {}

exports = module.exports = Base
