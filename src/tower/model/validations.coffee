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
    @runCallbacks "validate", =>
      validators      = @constructor.validators()
      success         = true
      errors          = @errors = {}
      
      for validator in validators
        unless validator.validateEach(@, errors)
          success = false
      
      callback.call @, null, success if callback
      success
  
module.exports = Tower.Model.Validations
