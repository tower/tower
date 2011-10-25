class Validations
  @validates: ->
    attributes = Array.prototype.slice.call(arguments, 0, arguments.length)
    options    = attributes.pop()
    
    Metro.throw_error("missing_options", "#{@name}.validates") unless typeof(options) == "object"
    
  @validators: ->
    @_validators ?= []
    
  validate: ->
    self        = @
    validators  = @constructor.validators()
    success     = true
    
    for validator in validators
      unless validator.validate(self)
        success = false
        
    success

module.exports = Validations
