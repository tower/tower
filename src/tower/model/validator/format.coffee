class Tower.Model.Validator.Format
  constructor: (value, attributes) ->
    super(value, attributes)
    
    @value = if typeof(value) == 'string' then new RegExp(value) else value
  
  validate: (record, attribute, errors, callback) ->
    value   = record.get(attribute)
    
    unless !!@value.exec(value)
      return @failure(
        record,
        attribute,
        errors,
        Tower.t("model.errors.format", attribute: attribute, value: @value.toString())
        callback
      )
    else
      @success(callback)
    
module.exports = Tower.Model.Validator.Format
