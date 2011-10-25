class Associations
  @hasOne: (name, options = {}) ->
  
  # Adds hasMany association to model.
  # 
  # @example Post with many categories
  # 
  #     class User
  #       @include Metro.Model
  #       
  #       @hasMany "categories", className: "Category"
  @hasMany: (name, options = {}) ->
    @associations()[name] = association = new Association(@className, name, options)
    
    Object.defineProperty @prototype, name, enumerable: true, configurable: true, 
      get: -> @_getAssociationScope(name)
      set: (value) -> @_setAssociationScope(name, value)
      
    association
  
  @belongsTo: ->
  
  @associations: ->
    @_associations ?= {}
    
  _getAssociationScope: (name) ->
    @constructor.associations()[name].scoped()
    
  _setAssociationScope: (name, value) ->
    @constructor.associations()[name].scoped().destroyAll()
  
module.exports = Associations
