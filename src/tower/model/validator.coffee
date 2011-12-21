class Tower.Model.Validator
  @create: (name, value, attributes) ->
    switch name
      when "presence"
        new @Presence(name, value, attributes)
      when "count", "length", "min", "max"
        new @Length(name, value, attributes)
      when "format"
        new @Format(name, value, attributes)
  
  constructor: (name, value, attributes) ->
    @name       = name
    @value      = value
    @attributes = attributes
  
  validateEach: (record, errors) ->
    success = true
    
    for attribute in @attributes
      unless @validate(record, attribute, errors)
        success = false
    success
    
require './validator/format'
require './validator/length'
require './validator/presence'
require './validator/uniqueness'

module.exports = Tower.Model.Validation
