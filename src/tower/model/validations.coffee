Tower.Model.Validations =
  ClassMethods:
    validates: ->
      attributes = Tower.Support.Array.args(arguments)
      options    = attributes.pop()
      validators = @validators()
      
      for key, value of options
        validators.push Tower.Model.Validator.create(key, value, attributes)
        
    validators: ->
      @_validators ||= []
  
  validate: (callback) ->
    success         = false
    @runCallbacks "validate", (block) =>
      complete        = @_callback(block, callback)
      validators      = @constructor.validators()
      errors          = @errors = {}
      
      iterator        = (validator, next) =>
        validator.validateEach @, errors, next
      
      Tower.async validators, iterator, (error) =>
        success = true unless error || Tower.Support.Object.isPresent(errors)
        complete.call(@, !success)
      
      success
    
    success
  
module.exports = Tower.Model.Validations
