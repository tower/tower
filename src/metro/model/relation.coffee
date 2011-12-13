class Metro.Model.Relation extends Metro.Object
  constructor: (owner, name, options = {}) ->
    @[key] = value for key, value of options
    
    @owner            = owner
    @name             = name
    @targetClassName  = Metro.namespaced(options.className || Metro.Support.String.camelize(name))
  
  scoped: (record) ->
    new @constructor.Scope(@targetClassName, record, @)
  
  class @Scope extends Metro.Model.Scope
    constructor: (sourceClassName, owner, association) ->
      super
      @owner            = owner
      @association      = association
      @foreignKey       = association.foreignKey
  
require './association/belongsTo'
require './association/hasMany'
require './association/hasOne'

module.exports = Metro.Model.Relation
