class Tower.Model.Validator.Presence extends Tower.Model.Validator
  validate: (record, attribute, errors) ->
    unless Tower.Support.Object.isPresent(record[attribute])
      errors[attribute] ||= []
      errors[attribute].push Tower.t("model.errors.presence", attribute: attribute)
      return false
    true

module.exports = Tower.Model.Validator.Presence
