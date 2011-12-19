class Coach.Model.Relation.HasMany extends Coach.Model.Relation
  # @param
  constructor: (owner, name, options = {}) ->
    super(owner, name, options)
    
    #if Coach.accessors
    #  Coach.Support.Object.defineProperty owner.prototype, name, 
    #    enumerable: true, 
    #    configurable: true, 
    #    get: -> @relation(name)
    #    set: (value) -> @relation(name).set(value)
    
    owner.prototype[name] = ->
      @relation(name)
    
    @foreignKey = options.foreignKey || Coach.Support.String.camelize("#{owner.name}Id", true)
    
    if @cache
      if typeof @cache == "string"
        @cache    = true
        @cacheKey = @cacheKey
      else
        @cacheKey = Coach.Support.String.singularize(name) + "Ids"
      
      @owner.field @cacheKey, type: "Array", default: []
  
  class @Scope extends @Scope
    constructor: (options = {}) ->
      super
      
      id = @owner.get("id")
      
      if @foreignKey && id != undefined
        defaults              = {}
        defaults[@foreignKey] = id
        @where defaults
        
    create: (attributes, callback) ->
      self        = @
      relation    = @relation
      
      @store().create Coach.Support.Object.extend(@criteria.query, attributes), @criteria.options, (error, record) ->
        unless error
          if relation && relation.cache
            updates = {}
            updates[relation.cacheKey] = record.get("id")
            self.owner.updateAttributes "$push": updates, callback
          else
            callback.call @, error, record if callback
        else
          callback.call @, error, record if callback
  
module.exports = Coach.Model.Relation.HasMany
