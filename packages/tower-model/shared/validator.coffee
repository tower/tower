_ = Tower._

class Tower.ModelValidator
  @keys:
    presence:     'presence'
    required:     'required'
    count:        'length'
    length:       'length'
    min:          'min'
    max:          'max'
    gte:          'gte'
    '>=':         'gte'
    gt:           'gt'
    '>':          'gt'
    lte:          'lte'
    '<=':         'lte'
    lt:           'lt'
    '<':          'lt'
    format:       'format'
    uniq:         'uniqueness'
    unique:       'uniqueness'
    uniqueness:   'uniqueness'
    in:           'in'
    notIn:        'notIn'
    except:       'except'
    only:         'only'
    accepts:      'accepts'
    confirmation: 'confirmation'

  @createAll: (attributes, validations = {}) ->
    options     = _.moveProperties({}, validations, 'on', 'if', 'unless', 'allow', 'scope')
    validators  = []

    for key, value of validations
      validatorOptions = _.clone(options)

      if _.isHash(value)
        validatorOptions = _.moveProperties(validatorOptions, value, 'on', 'if', 'unless', 'allow', 'scope')

      validators.push Tower.ModelValidator.create(key, value, attributes, validatorOptions)

    validators

  @create: (name, value, attributes, options) ->
    if typeof name == 'object'
      attributes = value
      @_create(key, value, attributes, options) for key, value of name
    else
      @_create(name, value, attributes, options)

  @_create: (name, value, attributes, options) ->
    switch name
      when 'presence', 'required'
        new Tower.ModelValidatorPresence(name, value, attributes, options)
      when 'count', 'length', 'min', 'max', 'gte', 'gt', 'lte', 'lt'
        new Tower.ModelValidatorLength(name, value, attributes, options)
      when 'format'
        new Tower.ModelValidatorFormat(name, value, attributes, options)
      when 'in', 'only', 'values', 'accepts'
        new Tower.ModelValidatorSet('in', value, attributes, options)
      when 'except', 'notIn'
        new Tower.ModelValidatorSet('notIn', value, attributes, options)
      when 'uniqueness', 'unique'
        new Tower.ModelValidatorUniqueness(name, value, attributes, options)
      when 'confirmation'
        new Tower.ModelValidatorConfirmation(name, value, attributes, options)

  constructor: (name, value, attributes, options = {}) ->
    @name       = name
    @value      = value
    @attributes = _.castArray(attributes)
    @options    = options

  # @todo cache these
  on: (action) ->
    value = @options.on
    return true unless value
    return value == action if typeof value == 'string'
    _.include(value, action)

  # Given a record, validate each attribute defined for this validator.
  #
  # @param [Tower.Model] record
  # @param [Object] errors
  # @param [Function] callback
  #
  # @return [void] Requires a callback.
  validateEach: (record, errors, callback) ->
    success = undefined

    @check record, (error, result) =>
      success = result

      if success
        iterator  = (attribute, next) =>
          @validate record, attribute, errors, (error) =>
            next()

        Tower.parallel @attributes, iterator, (error) =>
          success = !error
          callback.call(@, error) if callback
      else
        callback.call(@, error) if callback

    success

  check: (record, callback) ->
    options = @options

    if options.if
      @_callMethod record, options.if, (error, result) =>
        callback.call @, error, !!result
    else if options.unless
      @_callMethod record, options.unless, (error, result) =>
        callback.call @, error, !!!result
    else
      callback.call @, null, true

  # @abstract Implement in subclasses
  # validate: ->

  # Default implementation of success for this validator.
  #
  # @param [Function] callback
  #
  # @return [Boolean]
  success: (callback) ->
    callback.call @ if callback
    true

  # Default implementation of handling failure for this validator.
  #
  #
  # @param [Function] callback
  #
  # @return [Boolean]
  failure: (record, attribute, errors, message, callback) ->
    errors[attribute] ||= []
    errors[attribute].push message
    callback.call @, message if callback
    false

  getValue: (binding) ->
    if typeof @value == 'function'
      @value.call binding
    else
      @value

  _callMethod: (binding, method, callback) ->
    method = binding[method] if typeof method == 'string'

    switch method.length
      when 0
        callback.call(@, null, method.call(binding))
      else
        method.call binding, (error, result) =>
          callback.call(@, error, result)

    undefined

require './validator/format'
require './validator/length'
require './validator/presence'
require './validator/set'
require './validator/uniqueness'
require './validator/confirmation'

module.exports = Tower.ModelValidation
