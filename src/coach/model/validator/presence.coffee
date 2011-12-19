class Coach.Model.Validator.Presence extends Coach.Model.Validator
  validate: (record, attribute, errors) ->
    unless Coach.Support.Object.isPresent(record[attribute])
      errors[attribute] ||= []
      errors[attribute].push Coach.t("model.errors.presence", attribute: attribute)
      return false
    true

module.exports = Coach.Model.Validator.Presence
