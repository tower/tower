class Metro.Model.Relation.BelongsTo extends Metro.Model.Relation
  constructor: (owner, name, options = {}) ->
    super(owner, name, options)
    
    if Metro.accessors
      Metro.Support.Object.defineProperty owner.prototype, name, 
        enumerable: true, 
        configurable: true, 
        get: -> @relation(name).first()
        set: (value) -> @relation(name).set(value)
    
    owner.field "#{name}Id", type: "Id"
    
    self        = @
    
    owner.prototype["build#{Metro.Support.String.camelize(name)}"] = (attributes, callback) ->
      @buildRelation(name, attributes, callback)
      
    owner.prototype["create#{Metro.Support.String.camelize(name)}"] = (attributes, callback) ->
      @createRelation(name, attributes, callback)
      
  class @Scope extends @Scope
    # need to do something here about Reflection
  
module.exports = Metro.Model.Relation.BelongsTo
