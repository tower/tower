_ = Tower._

class Tower.ModelValidatorSet extends Tower.ModelValidator
  validate: (record, attribute, errors, callback) ->
    value     = record.get(attribute)
    testValue = @getValue(record)

    success = switch @name
      when 'in'
        _.indexOf(testValue, value) > -1
      when 'notIn'
        _.indexOf(testValue, value) == -1
      else
        false

    unless success
      return @failure(
        record,
        attribute,
        errors,
        Tower.t('model.errors.format', attribute: attribute, value: testValue.toString())
        callback
      )
    else
      @success(callback)

module.exports = Tower.ModelValidatorFormat
