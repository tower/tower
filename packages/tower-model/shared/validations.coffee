_ = Tower._

# @mixin
Tower.ModelValidations =
  ClassMethods:
    # Define validation(s) for attribute(s).
    #
    # @example Define one validation for one attribute
    #   class App.User extends Tower.Model
    #     @field 'email'
    #     @validates 'email', presence: true
    #
    # @example Define multiple validations for one attribute
    #   class App.User extends Tower.Model
    #     @field 'email'
    #     @validates 'email', presence: true, format: /\w+@\w+\.com/
    #
    # @example Define multiple validations for multiple attributes
    #   class App.User extends Tower.Model
    #     @field 'name'
    #     @field 'email'
    #     @validates 'name', 'email', presence: true, min: 3
    #
    # @example Validation for a date
    #   class App.Deal extends Tower.Model
    #     @field 'expiresAt', type: 'Date'
    #
    #     @validates 'expiresAt', '>=': -> _(7).days().after(@get('createdAt')), allow: blank: true, null: true
    #
    # @param [String] attributes
    # @param [Object] options
    # @option options [Boolean] presence
    # @option options [Integer] min
    # @option options [Integer] max
    # @option options [Integer] length
    # @option options [RegExp|String] format
    # @option options [Boolean] uniqueness
    # @option options [Boolean] numericality
    # @option options [Object] date
    # @option options [Boolean] phone
    # @option options [Boolean] email
    # @option options [Boolean] url
    # @option options [Boolean] slug
    # @option options [Boolean] postalCode
    # @option options [Object] allow
    # @option options [String] on
    # @option options [String|Function] if
    # @option options [String|Function] unless
    #
    #
    # @return [Array] Return the set of newly created validators.
    validates: ->
      attributes  = _.args(arguments)
      options     = attributes.pop()
      validators  = @validators()

      newValidators = Tower.ModelValidator.createAll(attributes, options)
      validators.push(validator) for validator in newValidators

      @

    # Array of validators defined for this model class.
    #
    # @return [Array]
    validators: ->
      switch arguments.length
        when 0
          @metadata().validators
        when 1
          @fields()[arguments[0]].validators()
        else
          fields = @fields()
          _.inject(_.args(arguments), ((name) -> fields[name].validators()), {})

  InstanceMethods:
    # Executes validations defined for the model.
    #
    # @param [Function] callback
    #
    # @return [void]
    # 
    # @todo make sure the callbacks execute in this order
    # - save
    # - valid
    # - before_validation
    # - validate
    # - after_validation
    # - before_save
    # - before_create
    # - create
    # - after_create
    # - after_save
    # - after_commit
    validate: (callback) ->
      success         = false

      @runCallbacks 'validate', (block) =>
        # @todo this is calling back too soon, we need first execute after validation callbacks,
        # then call the callback above
        complete        = @_callback(block, callback)
        validators      = @constructor.validators()
        errors          = {}
        @set('errors', errors)
        isNew           = @get('isNew')

        iterator        = (validator, next) =>
          # skip if it doesn't include update
          # @todo make more robust
          if !isNew && !validator.on('update')
            next()
          else
            validator.validateEach(@, errors, next)

        Tower.async validators, iterator, (error) =>
          if (!(_.isPresent(errors) || error))
            success = true
          # @todo need to handle afterValidation callbacks
          complete.call(@)

        success

      success

    # Need to establish a better comparison API/approach
    # 
    # @todo rename to isEqual
    equals: (object) ->
      if object instanceof Tower.Model
        @get('id').toString() == object.get('id').toString()
      else
        false

module.exports = Tower.ModelValidations
