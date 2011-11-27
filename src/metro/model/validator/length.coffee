class Metro.Model.Validator.Length extends Metro.Model.Validator
  constructor: (name, value, attributes) ->
    super
    
    @validate = switch name
      when "min" then @validateMinimum
      when "max" then @validateMaximum
      else
        @validateLength
  
  validateMinimum: (record, attribute, errors) ->
    value = record[attribute]
    unless typeof(value) == 'number' && value >= @value
      errors.push
        attribute: attribute
        message: Metro.t("model.errors.minimum", attribute: attribute, value: @value)
      return false
    true
  
  validateMaximum: (record, attribute, errors) ->
    value = record[attribute]
    unless typeof(value) == 'number' && value <= @value
      errors.push
        attribute: attribute
        message: Metro.t("model.errors.maximum", attribute: attribute, value: @value)
      return false
    true
  
  validateLength: (record, attribute, errors) ->
    value = record[attribute]
    unless typeof(value) == 'number' && value == @value
      errors.push
        attribute: attribute
        message: Metro.t("model.errors.length", attribute: attribute, value: @value)
      return false
    true

module.exports = Metro.Model.Validator.Length
