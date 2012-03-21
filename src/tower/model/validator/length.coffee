class Tower.Model.Validator.Length extends Tower.Model.Validator
  constructor: (name, value, attributes) ->
    super

    @validate = switch name
      when "min" then @validateMinimum
      when "max" then @validateMaximum
      else
        @validateLength

  validateMinimum: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    unless typeof(value) == 'number' && value >= @value
      return @failure(
        record,
        attribute,
        errors,
        Tower.t("model.errors.minimum", attribute: attribute, value: @value),
        callback
      )
    @success(callback)

  validateMaximum: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    unless typeof(value) == 'number' && value <= @value
      return @failure(
        record,
        attribute,
        errors,
        Tower.t("model.errors.maximum", attribute: attribute, value: @value),
        callback
      )
    @success(callback)

  validateLength: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    unless typeof(value) == 'number' && value == @value
      return @failure(
        record,
        attribute,
        errors,
        Tower.t("model.errors.length", attribute: attribute, value: @value)
        callback
      )
    @success(callback)

module.exports = Tower.Model.Validator.Length
