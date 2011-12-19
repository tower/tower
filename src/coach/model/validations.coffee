Coach.Model.Validations =
  ClassMethods:
    validate: ->
      attributes = Coach.Support.Array.args(arguments)
      options    = attributes.pop()
      
      Coach.raise("missing_options", "#{@name}.validates") unless typeof(options) == "object"
      
      validators = @validators()
      
      for key, value of options
        validators.push Coach.Model.Validator.create(key, value, attributes)
        
    validators: ->
      @_validators ||= []
  
  validate: ->
    validators      = @constructor.validators()
    success         = true
    errors          = @errors = {}
    
    for validator in validators
      unless validator.validateEach(@, errors)
        success = false
    
    success
  
module.exports = Coach.Model.Validations
