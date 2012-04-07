class Tower.Model.Validator
  @keys:
    presence:   'presence'
    required:   'required'
    count:      'length'
    length:     'length'
    min:        'min'
    max:        'max'
    gte:        'gte'
    '>=':       'gte'
    gt:         'gt'
    '>':        'gt'
    lte:        'lte'
    '<=':       'lte'
    lt:         'lt'
    '<':        'lt'
    format:     'format'
    unique:     'uniqueness'
    uniqueness: 'uniqueness'
    in:         'in'
    notIn:      'notIn'
    except:     'except'
    only:       'only'
    accepts:    'accepts'
    
  @createAll: (attributes, validations = {}) ->
    options     = _.moveProperties({}, validations, 'on', 'if', 'unless', 'allow')
    validators  = []
    
    for key, value of validations
      validatorOptions = _.clone(options)
      
      if _.isBaseObject(value)
        validatorOptions = _.moveProperties(validatorOptions, value, 'on', 'if', 'unless', 'allow')
        
      validators.push Tower.Model.Validator.create(key, value, attributes, validatorOptions)
      
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
        new @Presence(name, value, attributes, options)
      when 'count', 'length', 'min', 'max', 'gte', 'gt', 'lte', 'lt'
        new @Length(name, value, attributes, options)
      when 'format'
        new @Format(name, value, attributes, options)
      when 'in', 'except', 'only', 'notIn', 'values', 'accepts'
        new @Set(name, value, attributes, options)
  
  constructor: (name, value, attributes, options = {}) ->
    @name       = name
    @value      = value
    @attributes = _.castArray(attributes)
    @options    = options
  
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
        callback.call @, null, method.call binding
      else
        method.call binding, (error, result) =>
          callback.call @, error, result
    
    undefined

require './validator/format'
require './validator/length'
require './validator/presence'
require './validator/set'
require './validator/uniqueness'

module.exports = Tower.Model.Validation
