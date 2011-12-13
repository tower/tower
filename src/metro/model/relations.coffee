Metro.Model.Relations =
  #included: ->
  #  @relations = {}
  
  ClassMethods:
    hasOne: (name) ->
      @relations()[name]  = new Metro.Model.Relation.HasOne(@, name, options)
    
    # Adds hasMany relation to model.
    # 
    # @example Post with many categories
    # 
    #     class User extends Metro.Model
    #       @hasMany "categories", className: "Category"
    # 
    hasMany: (name) ->
      @relations()[name]  = new Metro.Model.Relation.HasMany(@, name, options)
    
    belongsTo: (name) ->      
      @relations()[name] = new Metro.Model.Relation.BelongsTo(@, name, options)
    
    relations: ->
      @_relations ||= {}

    relation: (name) ->
      relation = @relations()[name]
      throw new Error("Relation '#{name}' does not exist on '#{@name}'") unless relation
      relation
  
  InstanceMethods:
    relation: (name) ->
      @relations[name] ||= @constructor.relation(name).scoped(@)
      
    buildRelation: (name, attributes, callback) ->
      @relation(name).build(attributes, callback)
    
    createRelation: (name, attributes, callback) ->
      @relation(name).create(attributes, callback)
    
module.exports = Metro.Model.Relations
