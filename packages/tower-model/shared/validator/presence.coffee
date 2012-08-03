class Tower.ModelValidatorPresence extends Tower.ModelValidator
  validate: (record, attribute, errors, callback) ->
    unless _.isPresent(record.get(attribute))
      return @failure(
        record,
        attribute,
        errors,
        Tower.t('model.errors.presence', attribute: attribute),
        callback
      )
    @success(callback)

module.exports = Tower.ModelValidatorPresence
