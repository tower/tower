class Metro.Model.Validator.Presence extends Metro.Model.Validator
  validate: (record, attribute, errors) ->
    unless Metro.Support.Object.isPresent(record[attribute])
      errors[attribute] ||= []
      errors[attribute].push Metro.t("model.errors.presence", attribute: attribute)
      return false
    true

module.exports = Metro.Model.Validator.Presence
