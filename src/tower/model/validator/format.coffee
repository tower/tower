class Tower.Model.Validator.Format
  constructor: (value, attributes) ->
    super(value, attributes)
    
    @value = if typeof(value) == 'string' then new RegExp(value) else value
  
  validate: (record, attribute, errors) ->
    value = record[attribute]
    unless !!@value.exec(value)
      errors[attribute] ||= []
      errors[attribute].push Tower.t("model.errors.format", attribute: attribute, value: @value.toString())
      return false
    true
    
module.exports = Tower.Model.Validator.Format
