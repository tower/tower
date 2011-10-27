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
    options.foreignKey = "#{Metro.Support.String.underscore(@name)}Id"
    @associations()[name] = association = new Metro.Model.Association(@name, name, options)
    
    Object.defineProperty @prototype, name, 
      enumerable: true, 
      configurable: true, 
      get: -> @_getAssociationScope(name)
      set: (value) -> @_setAssociationScope(name, value)
      
    association
  
  @belongsTo: (name, options = {}) ->
    @associations()[name] = association = new Metro.Model.Association(@name, name, options)
    
    Object.defineProperty @prototype, name, 
      enumerable: true, 
      configurable: true, 
      get: -> @_getBelongsToAssocation(name)
      set: (value) -> @_setBelongsToAssocation(name, value)
    
    
    Object.defineProperty @prototype, "#{name}Id", 
      enumerable: true, 
      configurable: true, 
      get: -> @_getBelongsToAssocationId("#{name}Id")
      set: (value) -> @_setBelongsToAssocationId("#{name}Id", value)
    
    association
  
  @associations: ->
    @_associations ?= {}
    
  _getAssociationScope: (name) ->
    @constructor.associations()[name].scoped(@id)
    
  _setAssociationScope: (name, value) ->
    @constructor.associations()[name].scoped(@id).destroyAll()
    
  _getBelongsToAssocationId: (name) ->
    @attributes[name]
    
  _setBelongsToAssocationId: (name, value) ->
    @attributes[name] = value
    
  _getBelongsToAssocation: (name) ->
    id = @_getBelongsToAssocationId(name)
    return null unless id
    global[@associations()[name].targetClassName].where(id: @id).first()
    
  _setBelongsToAssocation: (name, value) ->
    id = @_getBelongsToAssocationId(name)
    return null unless id
    global[@associations()[name].targetClassName].where(id: @id).first()
  
module.exports = Associations
