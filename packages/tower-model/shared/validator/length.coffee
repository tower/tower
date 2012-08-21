class Tower.ModelValidatorLength extends Tower.ModelValidator
  constructor: (name, value, attributes, options) ->
    name = @valueCheck name, value
    value = value[name] ||= value
    super

    @validate = switch name
      when 'min' then @validateMinimum
      when 'max' then @validateMaximum
      when 'gte' then @validateGreaterThanOrEqual
      when 'gt' then @validateGreaterThan
      when 'lte' then @validateLessThanOrEqual
      when 'lt' then @validateLessThan
      else
        @validateLength

  validateGreaterThanOrEqual: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    if typeof value is 'string'
      value = value.length
    unless value >= @getValue(record)
      return @failure(
        record,
        attribute,
        errors,
        Tower.t('model.errors.minimum', attribute: attribute, value: @value),
        callback
      )
    @success(callback)

  validateGreaterThan: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    if typeof value is 'string'
      value = value.length
    unless value > @getValue(record)
      return @failure(
        record,
        attribute,
        errors,
        Tower.t('model.errors.minimum', attribute: attribute, value: @value),
        callback
      )
    @success(callback)

  validateLessThanOrEqual: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    if typeof value is 'string'
      value = value.length
    unless value <= @getValue(record)
      return @failure(
        record,
        attribute,
        errors,
        Tower.t('model.errors.minimum', attribute: attribute, value: @value),
        callback
      )
    @success(callback)

  validateLessThan: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    if typeof value is 'string'
      value = value.length
    unless value < @getValue(record)
      return @failure(
        record,
        attribute,
        errors,
        Tower.t('model.errors.minimum', attribute: attribute, value: @value),
        callback
      )
    @success(callback)

  validateMinimum: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    if typeof value is 'string'
      value = value.length
    unless typeof(value) == 'number' && value >= @getValue(record)
      return @failure(
        record,
        attribute,
        errors,
        Tower.t('model.errors.minimum', attribute: attribute, value: @value),
        callback
      )
    @success(callback)

  validateMaximum: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    if typeof value is 'string'
      value = value.length
    unless typeof(value) == 'number' && value <= @getValue(record)
      return @failure(
        record,
        attribute,
        errors,
        Tower.t('model.errors.maximum', attribute: attribute, value: @value),
        callback
      )
    @success(callback)

  validateLength: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    if typeof value is 'string'
      value = value.length
    unless typeof(value) == 'number' && value == @getValue(record)
      return @failure(
        record,
        attribute,
        errors,
        Tower.t('model.errors.length', attribute: attribute, value: @value)
        callback
      )
    @success(callback)

  valueCheck: (name, value) ->
    if typeof value == 'object'
      for key of value
        if key in ["min", "max", "gte", "gt", "lte", "lt"]
          return key
    return name

module.exports = Tower.ModelValidatorLength
