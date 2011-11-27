class Metro.Model.Association.BelongsTo extends Metro.Model.Association
  constructor: (owner, name, options = {}) ->
    super(owner, name, options)
  
    @foreignKey = options.foreignKey || Metro.Support.String.camelize("#{Metro.Support.String.singularize(name)}Id", true)
  
module.exports = Metro.Model.Association.BelongsTo
