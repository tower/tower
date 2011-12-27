Tower.Model.Validations =
  ClassMethods:
    validates: ->
      attributes = Tower.Support.Array.args(arguments)
      options    = attributes.pop()
      
      Tower.raise("missingOptions", "#{@name}.validates") unless typeof(options) == "object"
      
      validators = @validators()
      
      for key, value of options
        validators.push Tower.Model.Validator.create(key, value, attributes)
        
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
  
module.exports = Tower.Model.Validations
