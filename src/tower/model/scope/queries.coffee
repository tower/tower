Tower.Model.Scope.Queries =
  ClassMethods:
    queryMethods: [
      "where",
      "order",
      "asc",
      "desc",
      "limit",
      "offset",
      "select",
      "joins",
      "includes",
      "excludes",
      "paginate",
      "within",
      "allIn",
      "allOf",
      "alsoIn",
      "anyIn",
      "anyOf",
      "near",
      "notIn"
    ]

    queryOperators:
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

module.exports = Tower.Model.Scope.Queries
