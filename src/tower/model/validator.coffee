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
  
  validateEach: (record, errors, callback) ->
    iterator  = (attribute, next) =>
      @validate record, attribute, errors, (error) =>
        next()

    Tower.parallel @attributes, iterator, (error) =>
      callback.call(@, error) if callback

  success: (callback) ->
    callback.call @ if callback
    true

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
