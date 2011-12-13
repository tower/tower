class Metro.Model.Relation.HasMany extends Metro.Model.Relation
  constructor: (owner, name, options = {}) ->
    super(owner, name, options)
    
    if Metro.accessors
      Metro.Support.Object.defineProperty owner.prototype, name, 
        enumerable: true, 
        configurable: true, 
        get: -> @association(name)
        set: (value) -> @association(name).set(value)
    
    @foreignKey = options.foreignKey || Metro.Support.String.camelize("#{owner.name}Id", true)
    
    @cache      = false unless @hasOwnProperty("cache")
    if @cache
      if typeof @cache == "string"
        @cache    = true
        @cacheKey = @cacheKey
      else
        @cacheKey = Metro.Support.String.singularize(name) + "Ids"
      
      @owner.key @cacheKey, type: "array", default: []
  
  class @Scope extends @Scope
    constructor: (sourceClassName, owner, association) ->
      super
      
      if @foreignKey && @owner.id != undefined
        defaults = {}
        defaults[@foreignKey] = @owner.id 
        @where defaults
        
    create: (attributes, callback) ->
      self        = @
      association = @association
      
      @store().create Metro.Support.Object.extend(@query(), attributes), (error, record) ->
        unless error
          if association && association.cache
            updates = {}
            updates[association.cacheKey] = record.id
            self.owner.updateAttributes "$push": updates, callback
          else
            callback.call @, error, record if callback
        else
          callback.call @, error, record if callback
  
module.exports = Metro.Model.Relation.HasMany
