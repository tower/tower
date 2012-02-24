Tower.Model.Relations =
  ClassMethods:
    hasOne: (name, options = {}) ->
      @relations()[name]  = new Tower.Model.Relation.HasOne(@, name, options)
    
    hasMany: (name, options = {}) ->
      @relations()[name]  = new Tower.Model.Relation.HasMany(@, name, options)
      
    belongsTo: (name, options) ->
      @relations()[name]  = new Tower.Model.Relation.BelongsTo(@, name, options)
    
    relations: ->
      @_relations ||= {}
      
    relation: (name) ->
      relation = @relations()[name]
      throw new Error("Relation '#{name}' does not exist on '#{@name}'") unless relation
      relation
  
  relation: (name) ->
    @constructor.relation(name).scoped(@)
    
  buildRelation: (name, attributes, callback) ->
    @relation(name).build(attributes, callback)
  
  createRelation: (name, attributes, callback) ->
    @relation(name).create(attributes, callback)
    
  destroyRelations: ->
  
module.exports = Tower.Model.Relations
