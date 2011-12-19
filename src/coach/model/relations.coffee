Coach.Model.Relations =
  #included: ->
  #  @relations = {}
  
  ClassMethods:
    hasOne: (name, options) ->
      @relations()[name]  = new Coach.Model.Relation.HasOne(@, name, options)
    
    # Adds hasMany relation to model.
    # 
    # @example Post with many categories
    # 
    #     class User extends Coach.Model
    #       @hasMany "categories", className: "Category"
    # 
    hasMany: (name, options) ->
      @relations()[name]  = new Coach.Model.Relation.HasMany(@, name, options)
    
    belongsTo: (name, options) ->      
      @relations()[name]  = new Coach.Model.Relation.BelongsTo(@, name, options)
    
    relations: ->
      @_relations ||= {}

    relation: (name) ->
      relation = @relations()[name]
      throw new Error("Relation '#{name}' does not exist on '#{@name}'") unless relation
      relation
  
  InstanceMethods:
    relation: (name) ->
      @constructor.relation(name).scoped(@)
      
    buildRelation: (name, attributes, callback) ->
      @relation(name).build(attributes, callback)
    
    createRelation: (name, attributes, callback) ->
      @relation(name).create(attributes, callback)
    
module.exports = Coach.Model.Relations
