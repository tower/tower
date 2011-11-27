class Metro.Model.Association.HasMany extends Metro.Model.Association
  constructor: (owner, name, options = {}) ->
    super(owner, name, options)
    
    @foreignKey = options.foreignKey || Metro.Support.String.camelize("#{owner.name}Id", true)
  
module.exports = Metro.Model.Association.HasMany
