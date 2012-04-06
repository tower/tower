class Tower.Model.Validator.Length extends Tower.Model.Validator
  constructor: (name, value, attributes) ->
    super

    @validate = switch name
      when "min" then @validateMinimum
      when "max" then @validateMaximum
      when "gte" then @validateGreaterThanOrEqual
      when "gt" then @validateGreaterThan
      when "lte" then @validateLessThanOrEqual
      when "lt" then @validateLessThan
      else
        @validateLength
        
  validateGreaterThanOrEqual: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    unless value >= @getValue(record)
      return @failure(
        record,
        attribute,
        errors,
        Tower.t("model.errors.minimum", attribute: attribute, value: @value),
        callback
      )
    @success(callback)
    
  validateGreaterThan: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    unless value > @getValue(record)
      return @failure(
        record,
        attribute,
        errors,
        Tower.t("model.errors.minimum", attribute: attribute, value: @value),
        callback
      )
    @success(callback)
  
  validateLessThanOrEqual: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    unless value <= @getValue(record)
      return @failure(
        record,
        attribute,
        errors,
        Tower.t("model.errors.minimum", attribute: attribute, value: @value),
        callback
      )
    @success(callback)

  validateLessThan: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    unless value < @getValue(record)
      return @failure(
        record,
        attribute,
        errors,
        Tower.t("model.errors.minimum", attribute: attribute, value: @value),
        callback
      )
    @success(callback)

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
