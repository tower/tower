class Metro.Model.Association extends Metro.Object
  constructor: (owner, name, options = {}) ->
    if Metro.accessors
      Metro.Support.Object.defineProperty owner.prototype, name, 
        enumerable: true, 
        configurable: true, 
        get: -> @association(name)
        set: (value) -> @association(name).set(value)
    
    @owner            = owner
    @name             = name
    @targetClassName  = Metro.namespaced(options.className || Metro.Support.String.camelize(name))
  
  scoped: (record) ->
    (new Metro.Model.Scope(@targetClassName)).where(@conditions(record))
    
  conditions: (record) ->
    result = {}
    result[@foreignKey] = record.id if @foreignKey && record.id
    result
    
  @delegate "where", "find", "all", "first", "last", "store", to: "scoped"
  
require './association/belongsTo'
require './association/hasMany'
require './association/hasOne'

module.exports = Metro.Model.Association
