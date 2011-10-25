# Stores are the interface models use to find their data.
module.exports = Metro.Store =
  Cassandra:  require './store/cassandra'
  Local:      require './store/local'
  Memory:     require './store/memory'
  Mongo:      require './store/mongo'
  PostgreSQL: require './store/postgresql'
  Redis:      require './store/redis'
