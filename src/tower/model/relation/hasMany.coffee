# http://mongoosejs.com/docs/embedded-documents.html
# http://mongoid.org/docs/relations/embedded/1-n.html
class Tower.Model.Relation.HasMany extends Tower.Model.Relation
  ###
  # HasMany Relation
  #
  # Examples
  # 
  #     @hasMany "posts"
  #     @hasMany "articles", type: "Post"
  #     @hasMany "comments", as: "commentable"
  ###
  constructor: (owner, name, options = {}) ->
    super(owner, name, options)
    
    @polymorphic = options.hasOwnProperty("as")
    
    #if Tower.accessors
    #  Tower.Support.Object.defineProperty owner.prototype, name, 
    #    enumerable: true, 
    #    configurable: true, 
    #    get: -> @relation(name)
    #    set: (value) -> @relation(name).set(value)
    
    owner.prototype[name] = ->
      @relation(name)
    
    if options.foreignKey
      @foreignKey = options.foreignKey
    else if @as
      @foreignKey = "#{@as}Id"
    else
      @foreignKey = Tower.Support.String.camelize("#{owner.name}Id", true)
      
    @foreignType ||= "#{@as}Type" if @polymorphic
    
    if @cache
      if typeof @cache == "string"
        @cache    = true
        @cacheKey = @cacheKey
      else
        @cacheKey = Tower.Support.String.singularize(name) + "Ids"
      
      @owner.field @cacheKey, type: "Array", default: []
  
  class @Scope extends @Scope
    constructor: (options = {}) ->
      super(options)
      
      id = @owner.get("id")
      
      if @foreignKey
        defaults              = {}
        defaults[@foreignKey] = id if id != undefined
        defaults[@relation.foreignType] = @owner.constructor.name if @relation.foreignType
        @where defaults
    
    ###
    # @return {Server} for chaining
    # @api public
    ###    
    create: (attributes, callback) ->
      self        = @
      relation    = @relation
      
      @store().create Tower.Support.Object.extend(@criteria.query, attributes), @criteria.options, (error, record) ->
        unless error
          if relation && relation.cache
            updates = {}
            updates[relation.cacheKey] = record.get("id")
            self.owner.updateAttributes "$push": updates, callback
          else
            callback.call @, error, record if callback
        else
          callback.call @, error, record if callback
  
module.exports = Tower.Model.Relation.HasMany
