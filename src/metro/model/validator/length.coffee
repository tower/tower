class Metro.Model.Validator.Length extends Metro.Model.Validator  
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

module.exports = Metro.Model.Validator.Length
