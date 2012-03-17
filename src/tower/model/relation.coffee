class Tower.Model.Relation extends Tower.Class           
  # hasMany "commenters", source: "person", sourceType: "User", foreignKey: "userId", type
  constructor: (owner, name, options = {}, callback) ->
    @[key] = value for key, value of options
    
    @owner            = owner
    @name             = name
    @type             = Tower.namespaced(options.type || Tower.Support.String.camelize(Tower.Support.String.singularize(name)))
    @ownerType        = Tower.namespaced(owner.name)
    @dependent      ||= false
    @counterCache   ||= false
    @cache            = false unless @hasOwnProperty("cache")
    @readOnly         = false unless @hasOwnProperty("readOnly")
    @validate         = false unless @hasOwnProperty("validate")
    @autoSave         = false unless @hasOwnProperty("autoSave")
    @touch            = false unless @hasOwnProperty("touch")
    @inverseOf      ||= undefined
    @polymorphic      = options.hasOwnProperty("as") || !!options.polymorphic
    @default          = false unless @hasOwnProperty("default")
    @singularName       = Tower.Support.String.camelize(owner.name, true)
    @pluralName         = Tower.Support.String.pluralize(owner.name) # collectionName?
    @singularTargetName = Tower.Support.String.singularize(name)
    @pluralTargetName   = Tower.Support.String.pluralize(name)
    @targetType         = @type
    
    # hasMany "posts", foreignKey: "postId", cacheKey: "postIds"
    unless @foreignKey
      if @as
        @foreignKey = "#{@as}Id"
      else
        @foreignKey = "#{@singularName}Id"
      
    @foreignType ||= "#{@as}Type" if @polymorphic
    
    if @cache
      if typeof @cache == "string"
        @cacheKey = @cache
        @cache    = true
      else
        @cacheKey = @singularTargetName + "Ids"
      
      @owner.field @cacheKey, type: "Array", default: []
      
    if @counterCache
      if typeof @counterCache == "string"
        @counterCacheKey  = @counterCache
        @counterCache     = true
      else
        @counterCacheKey  = "#{@singularTargetName}Count"
      
      @owner.field @counterCacheKey, type: "Integer", default: 0
      
    @owner.prototype[name] = ->
      @relation(name)
  
  scoped: (record) ->
    new @constructor.Scope(model: @klass(), owner: record, relation: @)
    
  targetKlass: ->
    Tower.constant(@targetType)
    
  klass: ->
    Tower.constant(@type)
    
  inverse: ->
    return @_inverse if @_inverse
    relations = @targetKlass().relations()
    if @inverseOf
      return relations[@inverseOf]
    else
      for name, relation of relations
        # need a way to check if class extends another class in coffeescript...
        return relation if relation.inverseOf == @name
      for name, relation of relations
        return relation if relation.targetType == @ownerType
    null
  
  class @Scope extends Tower.Model.Scope
    isConstructable: ->
      !!!@relation.polymorphic
    
    constructor: (options = {}) ->
      super(options)
      @owner        = options.owner
      @relation     = options.relation
      
    clone: ->
      new @constructor(model: @model, criteria: @criteria.clone(), owner: @owner, relation: @relation)
      
    setInverseInstance: (record) ->
      if record && @invertibleFor(record)
        inverse = record.relation(@inverseReflectionFor(record).name)
        inverse.target = owner
    
    invertibleFor: (record) ->
      true
      
    inverse: (record) ->
      
  
require './relation/belongsTo'
require './relation/hasMany'
require './relation/hasOne'

module.exports = Tower.Model.Relation
