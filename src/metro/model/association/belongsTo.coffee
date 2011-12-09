class Metro.Model.Association.BelongsTo extends Metro.Model.Association
  constructor: (owner, name, options = {}) ->
    super(owner, name, options)
    
    if Metro.accessors
      Metro.Support.Object.defineProperty owner.prototype, name, 
        enumerable: true, 
        configurable: true, 
        get: -> @association(name).first()
        set: (value) -> @association(name).set(value)
    
    self        = @
    
    owner.prototype["build#{Metro.Support.String.camelize(name)}"] = (attributes, callback) ->
      @association(name).build(attributes, callback)
      
    owner.prototype["create#{Metro.Support.String.camelize(name)}"] = (attributes, callback) ->
      @association(name).create(attributes, callback)
      
  class @Scope extends @Scope
  
module.exports = Metro.Model.Association.BelongsTo
