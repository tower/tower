class Metro.Model.Validator.Format
  constructor: (value, attributes) ->
    super(value, attributes)
    
    @value = if typeof(value) == 'string' then new RegExp(value) else value
  
  validate: (record, attribute, errors) ->
    value = record[attribute]
    unless !!@value.exec(value)
      errors.push
        attribute: attribute
        message: Metro.t("model.errors.format", attribute: attribute, value: @value.toString())
      return false
    true
    
module.exports = Metro.Model.Validator.Format
