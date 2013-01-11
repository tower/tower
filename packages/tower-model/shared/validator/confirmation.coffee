class Tower.ModelValidatorConfirmation extends Tower.ModelValidator
  validate: (record, attribute, errors, callback) ->
    value = record.get(attribute)
    valueConfirmation = record.get(attribute + "Confirmation")

    unless value == valueConfirmation
      return @failure(
        record,
        attribute,
        errors,
        Tower.t(
          'model.errors.confirmation',
          attribute: attribute,
          value: value,
          valueConfirmation: valueConfirmation
        ),
        callback
      )
    @success(callback)

module.exports = Tower.ModelValidatorConfirmation
