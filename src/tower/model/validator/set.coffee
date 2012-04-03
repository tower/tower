class Tower.Model.Validator.Set
  constructor: (value, attributes) ->
    super(_.toArray(value), attributes)

  validate: (record, attribute, errors, callback) ->

module.exports = Tower.Model.Validator.Format
