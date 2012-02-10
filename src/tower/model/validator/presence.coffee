class Tower.Model.Validator.Presence extends Tower.Model.Validator
  validate: (record, attribute, errors, callback) ->
    unless Tower.Support.Object.isPresent(record.get(attribute))
      return @failure(
        record,
        attribute,
        errors,
        Tower.t("model.errors.presence", attribute: attribute),
        callback
      )
    @success(callback)

module.exports = Tower.Model.Validator.Presence
