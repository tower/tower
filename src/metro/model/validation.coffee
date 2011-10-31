class Metro.Model.Validation
  constructor: (name, value) ->
    @name       = name
    @value      = value
    @attributes = Array.prototype.slice.call(arguments, 2, arguments.length)
    
    @validationMethod = switch name
      when "presence" then @validatePresence
      when "min" then @validateMinimum
      when "max" then @validateMaximum
      when "count", "length" then @validateLength
      when "format"
        @value = new RegExp(@value) if typeof(@value) == 'string'
        @validateFormat
  
  validate: (record) ->
    success = true
    for attribute in @attributes
      unless @validationMethod(record, attribute)
        success = false
    success
    
  validatePresence: (record, attribute) ->
    unless !!record[attribute]
      record.errors().push
        attribute: attribute
        message: Metro.Support.I18n.t("metro.model.errors.validation.presence", attribute: attribute)
      return false
    true
  
  validateMinimum: (record, attribute) ->
    value = record[attribute]
    unless typeof(value) == 'number' && value >= @value
      record.errors().push 
        attribute: attribute
        message: Metro.Support.I18n.t("metro.model.errors.validation.minimum", attribute: attribute, value: value)
      return false
    true
  
  validateMaximum: (record, attribute) ->
    value = record[attribute]
    unless typeof(value) == 'number' && value <= @value
      record.errors().push attribute: attribute, message: "#{attribute} must be a maximum of #{@value}"
      return false
    true
  
  validateLength: (record, attribute) ->
    value = record[attribute]
    unless typeof(value) == 'number' && value == @value
      record.errors().push attribute: attribute, message: "#{attribute} must be equal to #{@value}"
      return false
    true
  
  validateFormat: (record, attribute) ->
    value = record[attribute]
    unless !!@value.exec(value)
      record.errors().push attribute: attribute, message: "#{attribute} must be match the format #{@value.toString()}"
      return false
    true

module.exports = Metro.Model.Validation
