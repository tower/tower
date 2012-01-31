class Tower.Model.Relation extends Tower.Class
  @VALID_FIND_OPTIONS = [
    "conditions", 
    "include", 
    "joins", 
    "limit", 
    "offset", 
    "extend", 
    "eagerLoad",
    "order", 
    "select", 
    "readonly", 
    "group", 
    "having", 
    "from", 
    "lock"
  ]
  
  @ASSOCIATION_METHODS = ["includes", 
    "eagerLoad", 
    "preload"
  ]
    
  @MULTI_VALUE_METHODS = ["select", 
    "group", 
    "order", 
    "joins", 
    "where", 
    "having", 
    "bind"
  ]
    
  @SINGLE_VALUE_METHODS = ["limit", 
    "offset", 
    "lock", 
    "readonly", 
    "from", 
    "reordering", 
    "reverseOrder", 
    "uniq"
  ]
                         
  # hasMany "commenters", source: "person", sourceType: "User", foreignKey: "userId", type
  constructor: (owner, name, options = {}, callback) ->
    @[key] = value for key, value of options
    
    @owner            = owner
    @name             = name
    @type             = Tower.namespaced(options.type || Tower.Support.String.camelize(Tower.Support.String.singularize(name)))
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
    @singularName       = Tower.Support.String.singularize(owner.name)
    @pluralName         = Tower.Support.String.pluralize(owner.name) # collectionName?
    @singularTargetName = Tower.Support.String.singularize(name)
    @pluralTargetName   = Tower.Support.String.singularize(name)
    @targetType         = Tower.Support.String.pluralize(name)
    
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
        @cacheKey = Tower.Support.String.pluralize(@foreignKey)
      
      @owner.field @cacheKey, type: "Array", default: []
      
    if @counterCache
      if typeof @counterCache == "string"
        @counterCacheKey  = @counterCache
        @counterCache     = true
      else
        @counterCacheKey  = "#{@singularName}Count"
      
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
    for name, relation in relations
      inverseName = relation.inverseOf || name
      # need a way to check if class extends another class in coffeescript...
      if inverseName == @name && relation.targetKlass == @klass()
        return @_inverse = relation
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
require './relation/hasManyThrough'
require './relation/hasOne'
require './relation/hasOneThrough'

module.exports = Tower.Model.Relation
