class Tower.Model.Relation extends Tower.Class
  
  # Construct a new relation.
  # 
  # @param [Function] owner Tower.Model class this relation is defined on.
  # @param [String] name name of the relation.
  # @param [Object] options options hash.
  # @option options [String] type name of the associated class.
  # @option options [Boolean] dependent (false) if true, relationship records
  #   will be destroyed if the owner record is destroyed.
  # @option options [Boolean] counterCache (false) if true, will increment `relationshipCount` variable
  #   when relationship is created/destroyed.
  # 
  # @see Tower.Model.Relations.ClassMethods#hasMany
  constructor: (owner, name, options = {}) ->
    @[key] = value for key, value of options
    
    @owner              = owner
    @name               = name
    
    @initialize(options)
    
  initialize: (options) ->  
    owner               = @owner
    name                = @name
    # @type               = Tower.namespaced(options.type || Tower.Support.String.camelize(Tower.Support.String.singularize(name)))
    @type               = options.type || Tower.Support.String.camelize(Tower.Support.String.singularize(name))
    @ownerType          = Tower.namespaced(owner.name)
    @dependent        ||= false
    @counterCache     ||= false
    @cache              = false unless @hasOwnProperty("cache")
    @readOnly           = false unless @hasOwnProperty("readOnly")
    @validate           = false unless @hasOwnProperty("validate")
    @autoSave           = false unless @hasOwnProperty("autoSave")
    @touch              = false unless @hasOwnProperty("touch")
    @inverseOf        ||= undefined
    @polymorphic        = options.hasOwnProperty("as") || !!options.polymorphic
    @default            = false unless @hasOwnProperty("default")
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

  # @return [Tower.Model.Relation.Scope]
  scoped: (record) ->
    new Tower.Model.Scope(new @constructor.Criteria(model: @klass(), owner: record, relation: @))
  
  # @return [Function]
  targetKlass: ->
    Tower.constant(@targetType)
  
  # Class for model on the other side of this relationship.
  # 
  # @return [Function]
  klass: ->
    Tower.constant(@type)
  
  # Relation on the associated object that maps back to this relation.
  # 
  # @return [Tower.Model.Relation]
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
  
  class @Criteria extends Tower.Model.Criteria
    isConstructable: ->
      !!!@relation.polymorphic
    
    constructor: (options = {}) ->
      super(options)
      @owner        = options.owner
      @relation     = options.relation
      @records      = []
    
    clone: ->
      (new @constructor(model: @model, owner: @owner, relation: @relation, records: @records.concat(), instantiate: @instantiate)).merge(@)
    
    setInverseInstance: (record) ->
      if record && @invertibleFor(record)
        inverse = record.relation(@inverseReflectionFor(record).name)
        inverse.target = owner

    invertibleFor: (record) ->
      true

    inverse: (record) ->

    _teardown: ->
      _.teardown(@, "relation", "records", "owner", "model", "criteria")

require './relation/belongsTo'
require './relation/hasMany'
require './relation/hasOne'

module.exports = Tower.Model.Relation
