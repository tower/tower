class Tower.Model.Relation extends Tower.Class
  # http://apidock.com/rails/ActiveRecord/Associations/ClassMethods/belongs_to
  # hasMany "articles", type: "Post"
  # 
  # @param foreignKey
  # @param primaryKey
  # @param dependent [false]
  # @param counterCache [false]
  # @param cache [false]
  # @param readOnly [false]
  # @param validate [false]
  # @param autoSave [false]
  # @param touch [false]
  # @param inverseOf [false]
  # @param polymorphic [false]
  # @param default [false]
  constructor: (owner, name, options = {}, callback) ->
    @[key] = value for key, value of options
    
    @owner            = owner
    @name             = name
    @targetClassName  = @type = Tower.namespaced(options.type || options.className || Tower.Support.String.camelize(Tower.Support.String.singularize(name)))
    # delete: Delete the child documents.
    # destroy: Destroy the child documents.
    # nullify: Orphan the child documents.
    @dependent      ||= false
    @counterCache   ||= false
    @cache            = false unless @hasOwnProperty("cache")
    @readOnly         = false unless @hasOwnProperty("readOnly")
    @validate         = false unless @hasOwnProperty("validate")
    @autoSave         = false unless @hasOwnProperty("autoSave")
    @touch            = false unless @hasOwnProperty("touch")
    @inverseOf      ||= undefined
    @polymorphic      = false unless @hasOwnProperty("polymorphic")
    @default          = false unless @hasOwnProperty("default")
  
  scoped: (record) ->
    new @constructor.Scope(model: Tower.constant(@targetClassName), owner: record, relation: @)
  
  class @Scope extends Tower.Model.Scope
    constructable: ->
      !!!@relation.polymorphic
    
    constructor: (options = {}) ->
      super(options)
      @owner        = options.owner
      @relation     = options.relation
      @foreignKey   = @relation.foreignKey
      
    clone: ->
      new @constructor(model: @model, criteria: @criteria.clone(), owner: @owner, relation: @relation)
      
    setInverseInstance: (record) ->
      if record && @invertibleFor(record)
        inverse = record.relation(@inverseReflectionFor(record).name)
        inverse.target = owner
    
    invertibleFor: (record) ->
      true
  
require './relation/belongsTo'
require './relation/hasMany'
require './relation/hasManyThrough'
require './relation/hasOne'
require './relation/hasOneThrough'

module.exports = Tower.Model.Relation
