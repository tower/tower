# @mixin
Tower.Model.Validations =
  ClassMethods:
    # Define validation(s) for attribute(s).
    # 
    # @example Define one validation for one attribute
    #   class App.User extends Tower.Model
    #     @field "email"
    #     @validates "email", presence: true
    # 
    # @example Define multiple validations for one attribute
    #   class App.User extends Tower.Model
    #     @field "email"
    #     @validates "email", presence: true, format: /\w+@\w+\.com/
    # 
    # @example Define multiple validations for multiple attributes
    #   class App.User extends Tower.Model
    #     @field "name"
    #     @field "email"
    #     @validates "name", "email", presence: true, min: 3
    # 
    # @example Validation for a date
    #   class App.Deal extends Tower.Model
    #     @field "expiresAt", type: "Date"
    # 
    #     @validates "expiresAt", ">=": -> _(7).days().after(@get('createdAt'))
    # 
    # @param [String] attributes
    # @param [Object] options
    # @option options [Boolean] presence
    # @option options [Integer] min
    # @option options [Integer] max
    # @option options [Integer] length
    # @option options [RegExp] format
    # @option options [Boolean] uniqueness
    # @option options [Boolean] numericality
    # @option options [Boolean] confirmation
    # @option options [Boolean] acceptance
    # @option options [Object] date
    # @option options [Boolean] phone
    # @option options [Boolean] email
    # @option options [Boolean] url
    # @option options [Boolean] slug
    # @option options [Boolean] postalCode
    # 
    # 
    # @return [Array] Return the set of newly created validators.
    validates: ->
      attributes = _.args(arguments)
      options    = attributes.pop()
      validators = @validators()

      for key, value of options
        validators.push Tower.Model.Validator.create(key, value, attributes)
    
    # Array of validators defined for this model class.
    # 
    # @return [Array]
    validators: ->
      @_validators ||= []
      
  InstanceMethods:
    # Executes validations defined for the model.
    # 
    # @param [Function] callback
    # 
    # @return [void]
    validate: (callback) ->
      success         = false
    
      @runCallbacks "validate", (block) =>
        complete        = @_callback(block, callback)
        validators      = @constructor.validators()
        errors          = @errors = {}

        iterator        = (validator, next) =>
          validator.validateEach @, errors, next

        Tower.async validators, iterator, (error) =>
          success = true unless error || _.isPresent(errors)
          complete.call(@, !success)

        success

      success

module.exports = Tower.Model.Validations
