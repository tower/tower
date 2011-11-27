Metro.Model.Associations =
  #included: ->
  #  @associations = {}
  
  ClassMethods:
    associations: ->
      @_associations ||= {}
      
    association: (name) ->
      association = @associations()[name]
      throw new Error("Reflection for '#{name}' does not exist on '#{@name}'") unless association
      association
      
    hasOne: (name, options = {}) ->
    
    # Adds hasMany association to model.
    # 
    # @example Post with many categories
    # 
    #     class User extends Metro.Model
    #       @hasMany "categories", className: "Category"
    # 
    hasMany: (name, options = {}) ->
      @associations()[name]  = new Metro.Model.Association.HasMany(@, name, options)
    
    belongsTo: (name, options = {}) ->      
      @associations()[name] = association = new Metro.Model.Association.BelongsTo(@, name, options)
      @key "#{name}Id"
      
      association
  
  InstanceMethods:
    association: (name) ->
      @associations[name] ||= @constructor.association(name).scoped(@)
    
module.exports = Metro.Model.Associations
