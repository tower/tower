class Coach.Model.Validator.Length extends Coach.Model.Validator
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
      errors[attribute] ||= []
      errors[attribute].push Coach.t("model.errors.minimum", attribute: attribute, value: @value)
      return false
    true
  
  validateMaximum: (record, attribute, errors) ->
    value = record[attribute]
    unless typeof(value) == 'number' && value <= @value
      errors[attribute] ||= []
      errors[attribute].push Coach.t("model.errors.maximum", attribute: attribute, value: @value)
      return false
    true
  
  validateLength: (record, attribute, errors) ->
    value = record[attribute]
    unless typeof(value) == 'number' && value == @value
      errors[attribute] ||= []
      errors[attribute].push Coach.t("model.errors.length", attribute: attribute, value: @value)
      return false
    true

module.exports = Coach.Model.Validator.Length
