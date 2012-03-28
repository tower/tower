class Tower.Model.Validator.Set
  constructor: (value, attributes) ->
    super(Tower.Support.Object.toArray(value), attributes)

  validate: (record, attribute, errors, callback) ->

module.exports = Tower.Model.Validator.Format
