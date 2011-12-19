class Coach.Model.Relation.BelongsTo extends Coach.Model.Relation
  constructor: (owner, name, options = {}) ->
    super(owner, name, options)
    
    #if Coach.accessors
    #  Coach.Support.Object.defineProperty owner.prototype, name, 
    #    enumerable: true, 
    #    configurable: true, 
    #    get: -> @relation(name).first()
    #    set: (value) -> @relation(name).set(value)
    
    owner.field "#{name}Id", type: "Id"
    
    owner.prototype[name] = (callback) ->
      @relation(name).first(callback)
    
    self        = @
    
    owner.prototype["build#{Coach.Support.String.camelize(name)}"] = (attributes, callback) ->
      @buildRelation(name, attributes, callback)
      
    owner.prototype["create#{Coach.Support.String.camelize(name)}"] = (attributes, callback) ->
      @createRelation(name, attributes, callback)
      
  class @Scope extends @Scope
    # need to do something here about Reflection
  
module.exports = Coach.Model.Relation.BelongsTo
