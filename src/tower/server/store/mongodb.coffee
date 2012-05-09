# Tower's MongoDB datastore
class Tower.Store.MongoDB extends Tower.Store

require './mongodb/configuration'
require './mongodb/database'
require './mongodb/finders'
require './mongodb/persistence'
require './mongodb/serialization'

Tower.Store.MongoDB.include Tower.Store.Memory.Serialization
Tower.Store.MongoDB.include Tower.Store.MongoDB.Configuration
Tower.Store.MongoDB.include Tower.Store.MongoDB.Database
Tower.Store.MongoDB.include Tower.Store.MongoDB.Finders
Tower.Store.MongoDB.include Tower.Store.MongoDB.Persistence
Tower.Store.MongoDB.include Tower.Store.MongoDB.Serialization

# callbacks run in sequence, events run in parallel
Tower.callback "initialize", name: "Tower.Store.MongoDB.initialize", (done) ->
  try Tower.Store.MongoDB.configure Tower.config.databases.mongodb
  Tower.Store.MongoDB.initialize done

module.exports = Tower.Store.MongoDB
