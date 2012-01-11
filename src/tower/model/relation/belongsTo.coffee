class Tower.Model.Relation.BelongsTo extends Tower.Model.Relation
  constructor: (owner, name, options = {}) ->
    super(owner, name, options)
    
    #if Tower.accessors
    #  Tower.Support.Object.defineProperty owner.prototype, name, 
    #    enumerable: true, 
    #    configurable: true, 
    #    get: -> @relation(name).first()
    #    set: (value) -> @relation(name).set(value)
    
    @foreignKey = "#{name}Id"
    owner.field @foreignKey, type: "Id"
    
    if @polymorphic
      @foreignType = "#{name}Type"
      owner.field @foreignType, type: "String"
    
    owner.prototype[name] = (callback) ->
      @relation(name).first(callback)
    
    self        = @
    
    owner.prototype["build#{Tower.Support.String.camelize(name)}"] = (attributes, callback) ->
      @buildRelation(name, attributes, callback)
      
    owner.prototype["create#{Tower.Support.String.camelize(name)}"] = (attributes, callback) ->
      @createRelation(name, attributes, callback)
      
  class @Scope extends @Scope
    # need to do something here about Reflection
  
module.exports = Tower.Model.Relation.BelongsTo
