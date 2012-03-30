class Tower.Model.Validator
  @create: (name, value, attributes) ->
    if typeof name == "object"
      attributes = value
      @_create(key, value, attributes) for key, value of name
    else
      @_create(name, value, attributes)
  
  @_create: (name, value, attributes) ->
    switch name
      when "presence", "required"
        new @Presence(name, value, attributes)
      when "count", "length", "min", "max"
        new @Length(name, value, attributes)
      when "format"
        new @Format(name, value, attributes)
      when "in", "except", "only", "notIn", "values", "accepts"
        new @Set(name, value, attributes)
  
  constructor: (name, value, attributes) ->
    @name       = name
    @value      = value
    @attributes = Tower.Support.Object.toArray(attributes)
  
  # Given a record, validate each attribute defined for this validator.
  # 
  # @param [Tower.Model] record
  # @param [Object] errors
  # @param [Function] callback
  #
  # @return [void] Requires a callback.
  validateEach: (record, errors, callback) ->
    iterator  = (attribute, next) =>
      @validate record, attribute, errors, (error) =>
        next()

    Tower.parallel @attributes, iterator, (error) =>
      callback.call(@, error) if callback
      
    undefined
  
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

require './validator/format'
require './validator/length'
require './validator/presence'
require './validator/set'
require './validator/uniqueness'

module.exports = Tower.Model.Validation
