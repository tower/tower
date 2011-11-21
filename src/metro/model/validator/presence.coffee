class Metro.Model.Validator.Presence extends Metro.Model.Validator
  validate: (record, attribute, errors) ->
    unless !!record[attribute]
      errors.push
        attribute: attribute
        message: Metro.Support.I18n.t("metro.model.errors.validation.presence", attribute: attribute)
      return false
    true

module.exports = Metro.Model.Validator.Presence
