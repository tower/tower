module.exports = Metro.Store = {
  Cassandra: require('./store/cassandra'),
  Local: require('./store/local'),
  Memory: require('./store/memory'),
  Mongo: require('./store/mongo'),
  PostgreSQL: require('./store/postgresql'),
  Redis: require('./store/redis'),
  defaultLimit: 100,
  reservedOperators: {
    "_sort": "_sort",
    "_limit": "_limit"
  },
  queryOperators: {
    ">=": "gte",
    "gte": "gte",
    ">": "gt",
    "gt": "gt",
    "<=": "lte",
    "lte": "lte",
    "<": "lt",
    "lt": "lt",
    "in": "in",
    "nin": "nin",
    "any": "any",
    "all": "all",
    "=~": "m",
    "m": "m",
    "!~": "nm",
    "nm": "nm",
    "=": "eq",
    "eq": "eq",
    "!=": "neq",
    "neq": "neq"
  }
};