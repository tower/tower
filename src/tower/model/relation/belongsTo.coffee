class Tower.Model.Relation.BelongsTo extends Tower.Model.Relation
  constructor: (owner, name, options = {}) ->
    super(owner, name, options)

    @foreignKey = "#{name}Id"
    owner.field @foreignKey, type: "Id"
    
    if @polymorphic
      @foreignType = "#{name}Type"
      owner.field @foreignType, type: "String"
    
    owner.prototype[name] = ->
      @relation(name)
    
    owner.prototype["build#{Tower.Support.String.camelize(name)}"] = (attributes, callback) ->
      @buildRelation(name, attributes, callback)

    owner.prototype["create#{Tower.Support.String.camelize(name)}"] = (attributes, callback) ->
      @createRelation(name, attributes, callback)

  class @Criteria extends @Criteria
    isBelongsTo: true
    # need to do something here about Reflection
    
    toCriteria: ->
      criteria  = super
      relation  = @relation
      
      # @todo shouldn't have to do $in here...
      criteria.where(id: $in: [@owner.get(relation.foreignKey)])

      criteria

module.exports = Tower.Model.Relation.BelongsTo
