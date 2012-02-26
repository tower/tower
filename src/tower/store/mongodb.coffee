class Tower.Store.MongoDB extends Tower.Store

require './mongodb/configuration'
require './mongodb/database'
require './mongodb/finders'
require './mongodb/graph'
require './mongodb/inheritance'
require './mongodb/persistence'
require './mongodb/serialization'

Tower.Store.MongoDB.include Tower.Store.Memory.Serialization
Tower.Store.MongoDB.include Tower.Store.MongoDB.Configuration
Tower.Store.MongoDB.include Tower.Store.MongoDB.Database
Tower.Store.MongoDB.include Tower.Store.MongoDB.Finders
Tower.Store.MongoDB.include Tower.Store.MongoDB.Graph
Tower.Store.MongoDB.include Tower.Store.MongoDB.Inheritance
Tower.Store.MongoDB.include Tower.Store.MongoDB.Persistence
Tower.Store.MongoDB.include Tower.Store.MongoDB.Serialization

module.exports = Tower.Store.MongoDB
