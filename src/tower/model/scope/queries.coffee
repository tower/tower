Tower.Model.Scope.Queries =
  ClassMethods:
    # These methods are added to {Tower.Model}.
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

    # Map of human readable query operators to
    # normalized query operators to pass to a {Tower.Store}.
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
