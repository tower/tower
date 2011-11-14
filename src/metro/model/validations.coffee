class Metro.Model.Validations
  constructor: -> super
  
  @validates: ->
    attributes = Array.prototype.slice.call(arguments, 0, arguments.length)
    options    = attributes.pop()
    
    Metro.throw_error("missing_options", "#{@name}.validates") unless typeof(options) == "object"
    
    validators = @validators()
    
    for key, value of options
      validators.push new Metro.Model.Validation(key, value, attributes...)
    
  @validators: ->
    @_validators ||= []
    
  validate: ->
    self        = @
    validators  = @constructor.validators()
    success     = true
    @errors().length = 0
    
    for validator in validators
      unless validator.validate(self)
        success = false
        
    success
  
  errors: ->
    @_errors ||= []
  
module.exports = Metro.Model.Validations
