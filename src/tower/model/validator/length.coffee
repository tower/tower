class Tower.Model.Validator.Length extends Tower.Model.Validator
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
      return @error record, attribute, errors, Tower.t("model.errors.minimum", attribute: attribute, value: @value)
    true
  
  validateMaximum: (record, attribute, errors) ->
    value = record[attribute]
    unless typeof(value) == 'number' && value <= @value
      errors[attribute] ||= []
      errors[attribute].push Tower.t("model.errors.maximum", attribute: attribute, value: @value)
      return false
    true
  
  validateLength: (record, attribute, errors) ->
    value = record[attribute]
    unless typeof(value) == 'number' && value == @value
      errors[attribute] ||= []
      errors[attribute].push Tower.t("model.errors.length", attribute: attribute, value: @value)
      return false
    true

module.exports = Tower.Model.Validator.Length
