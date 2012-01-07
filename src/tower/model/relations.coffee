Tower.Model.Relations =
  #included: ->
  #  @relations = {}
  
  ClassMethods:
    hasOne: (name, options) ->
      if options && options.hasOwnProperty("through")
        relationClass = Tower.Model.Relation.HasOneThrough
      else
        relationClass = Tower.Model.Relation.HasOne

      @relations()[name]  = new relationClass(@, name, options)
    
    # Adds hasMany relation to model.
    # 
    # @example Post with many categories
    # 
    #     class User extends Tower.Model
    #       @hasMany "categories", className: "Category"
    # 
    hasMany: (name, options) ->
      if options && options.hasOwnProperty("through")
        relationClass = Tower.Model.Relation.HasManyThrough
      else
        relationClass = Tower.Model.Relation.HasMany
        
      @relations()[name]  = new relationClass(@, name, options)
    
    belongsTo: (name, options) ->
      @relations()[name]  = new Tower.Model.Relation.BelongsTo(@, name, options)
    
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
      
    destroyRelations: ->
    
module.exports = Tower.Model.Relations
