class Tower.Model.Relation.HasManyThrough extends Tower.Model.Relation.HasMany
  class @Scope extends @Scope
    toCriteria: ->
      criteria  = super
      relation  = @relation