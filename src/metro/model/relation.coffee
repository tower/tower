class Metro.Model.Relation extends Metro.Object
  constructor: (owner, name, options = {}) ->
    @[key] = value for key, value of options
    
    @owner            = owner
    @name             = name
    @targetClassName  = Metro.namespaced(options.className || Metro.Support.String.camelize(name))
  
  scoped: (record) ->
    new @constructor.Scope(model: Metro.constant(@targetClassName), owner: record, relation: @)
  
  class @Scope extends Metro.Model.Scope
    constructor: (options = {}) ->
      super
      @owner        = options.owner
      @relation     = options.relation
      @foreignKey   = @relation.foreignKey
  
require './relation/belongsTo'
require './relation/hasMany'
require './relation/hasOne'

module.exports = Metro.Model.Relation
