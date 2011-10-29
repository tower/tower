class Associations
  @hasOne: (name, options = {}) ->
  
  # Adds hasMany reflection to model.
  # 
  # @example Post with many categories
  # 
  #     class User
  #       @include Metro.Model
  #       
  #       @hasMany "categories", className: "Category"
  @hasMany: (name, options = {}) ->
    options.foreignKey = "#{Metro.Support.String.underscore(@name)}Id"
    @reflections()[name] = reflection = new Metro.Model.Reflection("hasMany", @name, name, options)
    
    Object.defineProperty @prototype, name, 
      enumerable: true, 
      configurable: true, 
      get: -> @_getHasManyAssociation(name)
      set: (value) -> @_setHasManyAssociation(name, value)
      
    reflection
  
  @belongsTo: (name, options = {}) ->
    @reflections()[name] = reflection = new Metro.Model.Association("belongsTo", @name, name, options)
    
    Object.defineProperty @prototype, name, 
      enumerable: true, 
      configurable: true, 
      get: -> @_getBelongsToAssocation(name)
      set: (value) -> @_setBelongsToAssocation(name, value)
    
    @keys()["#{name}Id"] = new Metro.Model.Attribute("#{name}Id", options)
    
    Object.defineProperty @prototype, "#{name}Id", 
      enumerable: true, 
      configurable: true, 
      get: -> @_getBelongsToAssocationId("#{name}Id")
      set: (value) -> @_setBelongsToAssocationId("#{name}Id", value)
    
    reflection
  
  @reflections: ->
    @_reflections ?= {}
    
  _getHasManyAssociation: (name) ->
    @constructor.reflections()[name].association(@id)
    
  _setHasManyAssociation: (name, value) ->
    @constructor.reflections()[name].association(@id).destroyAll()
    
  _getBelongsToAssocationId: (name) ->
    @attributes[name]
    
  _setBelongsToAssocationId: (name, value) ->
    @attributes[name] = value
    
  _getBelongsToAssocation: (name) ->
    id = @_getBelongsToAssocationId(name)
    return null unless id
    global[@reflections()[name].targetClassName].where(id: @id).first()
    
  _setBelongsToAssocation: (name, value) ->
    id = @_getBelongsToAssocationId(name)
    return null unless id
    global[@reflections()[name].targetClassName].where(id: @id).first()
  
module.exports = Associations
