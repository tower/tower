class Tower.Model.Validator.Uniqueness extends Tower.Model.Validator
  constructor: (name, value, attributes, options) ->
    super(name, value, attributes, options)

  validate: (record, attribute, errors, callback) ->
    value       = record.get(attribute)
    conditions  = {}
    conditions[attribute] = value
    scope = @value
    scope = @value.scope if _.isHash(scope)
    
    if typeof scope == 'string'
      conditions[scope] = record.get(scope)

    record.constructor.where(conditions).exists (error, result) =>
      if result
        return @failure(
          record,
          attribute,
          errors,
          Tower.t('model.errors.uniqueness', attribute: attribute, value: value),
          callback
        )
      else
        @success(callback)

module.exports = Tower.Model.Validator.Uniqueness
