class Tower.Model.Validator.Format extends Tower.Model.Validator
  constructor: (name, value, attributes, options) ->
    super(name, value, attributes, options)

    if @value.hasOwnProperty('value')
      @value    = @value.value

    if typeof @value == 'string'
      @matcher  = "is#{_.camelCase(value, true)}"

  validate: (record, attribute, errors, callback) ->
    value   = record.get(attribute)

    success = if @matcher then !!_[@matcher](value) else !!@value.exec(value)

    unless success
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
