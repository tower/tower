Metro.Model.Validations =
  ClassMethods:
    validate: ->
      attributes = Metro.Support.Array.args(arguments)
      options    = attributes.pop()
      
      Metro.raise("missing_options", "#{@name}.validates") unless typeof(options) == "object"
      
      validators = @validators()
      
      for key, value of options
        validators.push Metro.Model.Validator.create(key, value, attributes)
        
    validators: ->
      @_validators ||= []
  
  validate: ->
    validators      = @constructor.validators()
    success         = true
    errors          = @errors
    errors.length   = 0
    
    for validator in validators
      unless validator.validateEach(@, errors)
        success = false
    
    success
  
module.exports = Metro.Model.Validations
