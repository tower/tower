class Tower.Model.Validator.Uniqueness extends Tower.Model.Validator
  validate: (record, attribute, errors, callback) ->
    value       = record.get(attribute)
    conditions  = {}
    conditions[attribute] = value
    record.constructor.where(conditions).exists (error, result) =>
      if result
        return @failure(
          record,
          attribute,
          errors,
          Tower.t("model.errors.uniqueness", attribute: attribute, value: value),
          callback
        )
      else
        @success(callback)

module.exports = Tower.Model.Validator.Uniqueness
