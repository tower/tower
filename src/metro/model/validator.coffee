class Metro.Model.Validator
  @create: (name, value, attributes) ->
    switch name
      when "presence"
        new @Presence
      when "count", "length", "min", "max"
        new @Length
      when "format"
        new @Format(value, attributes)
  
  constructor: (value, attributes) ->
    @value      = value
    @attributes = attributes
  
  validateEach: (record, errors = []) ->
    success = true
    for attribute in @attributes
      unless @validate(record, attribute, errors)
        success = false
    success

module.exports = Metro.Model.Validation
