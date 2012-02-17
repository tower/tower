require '../config'

describe 'Tower.Store', ->
  test '.queryOperators', ->
    queryOperators =
      ">=":       "$gte"
      "$gte":     "$gte"
      ">":        "$gt"
      "$gt":      "$gt"
      "<=":       "$lte"
      "$lte":     "$lte"
      "<":        "$lt"
      "$lt":      "$lt"
      "$in":      "$in"
      "$nin":     "$nin"
      "$any":     "$any"
      "$all":     "$all"
      "=~":       "$regex"
      "$m":       "$regex"
      "$regex":   "$regex"
      "$match":   "$match"
      "$notMatch":   "$notMatch"
      "!~":       "$nm"
      "$nm":      "$nm"
      "=":        "$eq"
      "$eq":      "$eq"
      "!=":       "$neq"
      "$neq":     "$neq"
      "$null":    "$null"
      "$notNull": "$notNull"
    
    for key, value of queryOperators
      expect(Tower.Store.queryOperators[key]).toEqual value
  
  test '.atomicModifiers', ->
    atomicModifiers =
      "$set":     "$set"
      "$unset":   "$unset"
      "$push":    "$push"
      "$pushAll": "$pushAll"
      "$pull":    "$pull"
      "$pullAll": "$pullAll"
      "$inc":     "$inc"
      "$pop":     "$pop"
    
    for key, value of atomicModifiers
      expect(Tower.Store.atomicModifiers[key]).toEqual value
      
  test '.defaultLimit', ->
    expect(Tower.Store.defaultLimit).toEqual 100