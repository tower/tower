# Tower's Mongodb datastore
class Tower.Store.Mongodb extends Tower.Store

require './mongodb/configuration'
require './mongodb/database'
require './mongodb/finders'
require './mongodb/persistence'
require './mongodb/serialization'

Tower.Store.Mongodb.include Tower.Store.Mongodb.Configuration
Tower.Store.Mongodb.include Tower.Store.Mongodb.Database
Tower.Store.Mongodb.include Tower.Store.Mongodb.Finders
Tower.Store.Mongodb.include Tower.Store.Mongodb.Persistence
Tower.Store.Mongodb.include Tower.Store.Mongodb.Serialization

module.exports = Tower.Store.Mongodb
