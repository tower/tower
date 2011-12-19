class Coach.Model.Relation extends Coach.Class
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
    @targetClassName  = options.type || options.className || Coach.namespaced(Coach.Support.String.camelize(name))
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
    new @constructor.Scope(model: Coach.constant(@targetClassName), owner: record, relation: @)
  
  class @Scope extends Coach.Model.Scope
    constructable: ->
      !!!@relation.polymorphic
    
    constructor: (options = {}) ->
      super
      @owner        = options.owner
      @relation     = options.relation
      @foreignKey   = @relation.foreignKey
  
require './relation/belongsTo'
require './relation/hasMany'
require './relation/hasOne'

module.exports = Coach.Model.Relation
