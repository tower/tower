class Tower.Model.Validator.Uniqueness extends Tower.Model.Validator
  validate: (record, attribute, errors) ->
    true

module.exports = Tower.Model.Validator.Uniqueness
