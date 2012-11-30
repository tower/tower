# Tower's Mongodb datastore
class Tower.StoreMongodb extends Tower.Store

require './mongodb/configuration'
require './mongodb/database'
require './mongodb/finders'
require './mongodb/persistence'
require './mongodb/serialization'

Tower.StoreMongodb.include Tower.StoreMongodbConfiguration
Tower.StoreMongodb.include Tower.StoreMongodbDatabase
Tower.StoreMongodb.include Tower.StoreMongodbFinders
Tower.StoreMongodb.include Tower.StoreMongodbPersistence
Tower.StoreMongodb.include Tower.StoreMongodbSerialization

module.exports = Tower.StoreMongodb
