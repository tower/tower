class Attribute
  constructor: (type) ->
    @type = type
    @typecastMethod = switch type
      when Array then _typecastArray
    
  typecast: (value) ->
    @typecastMethod.call(@, value)
    
module.exports = Attribute
