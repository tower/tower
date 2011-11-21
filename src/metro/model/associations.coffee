Metro.Model.Associations =
  #included: ->
  #  @reflections = {}
  
  ClassMethods:
    reflections: ->
      @_reflections ||= {}
      
    hasOne: (name, options = {}) ->
    
    # Adds hasMany reflection to model.
    # 
    # @example Post with many categories
    # 
    #     class User extends Metro.Model
    #       @hasMany "categories", className: "Category"
    # 
    hasMany: (name, options = {}) ->
      options.foreignKey = "#{Metro.Support.String.underscore(@name)}Id"
      @reflections()[name] = reflection = new Metro.Model.Reflection("hasMany", @name, name, options)
      
      Metro.Support.Object.defineProperty @::, name, 
        enumerable: true, 
        configurable: true, 
        get: -> @association(name)
        set: (value) -> @association(name).set(value)
      
      reflection
    
    belongsTo: (name, options = {}) ->      
      @reflections()[name] = reflection = new Metro.Model.Association("belongsTo", @name, name, options)
      
      Metro.Support.Object.defineProperty @::, name, 
        enumerable: true, 
        configurable: true, 
        get: -> @_getBelongsToAssocation(name)
        set: (value) -> @_setBelongsToAssocation(name, value)
        
      nameId = "#{name}Id"
      
      @keys[nameId] = new Metro.Model.Attribute(nameId, options)
      
      Metro.Support.Object.defineProperty @::, nameId, 
        enumerable: true, 
        configurable: true, 
        get: -> @association(name).getId()
        set: (value) -> @association(name).setId(value)
      
      reflection
  
  InstanceMethods:
    association: (name) ->
      @associations[name] ||= @constructor.reflections()[name].association(@)
    
module.exports = Metro.Model.Associations
