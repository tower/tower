class Coach.Store.MongoDB extends Coach.Store

require './mongodb/configuration'
require './mongodb/database'
require './mongodb/finders'
require './mongodb/graph'
require './mongodb/inheritance'
require './mongodb/persistence'
require './mongodb/serialization'

Coach.Store.MongoDB.include Coach.Store.MongoDB.Configuration
Coach.Store.MongoDB.include Coach.Store.MongoDB.Database
Coach.Store.MongoDB.include Coach.Store.MongoDB.Finders
Coach.Store.MongoDB.include Coach.Store.MongoDB.Graph
Coach.Store.MongoDB.include Coach.Store.MongoDB.Inheritance
Coach.Store.MongoDB.include Coach.Store.MongoDB.Persistence
Coach.Store.MongoDB.include Coach.Store.MongoDB.Serialization

module.exports = Coach.Store.MongoDB
