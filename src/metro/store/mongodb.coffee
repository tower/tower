class Metro.Store.MongoDB extends Metro.Store

require './mongodb/configuration'
require './mongodb/database'
require './mongodb/finders'
require './mongodb/graph'
require './mongodb/inheritance'
require './mongodb/persistence'
require './mongodb/serialization'

Metro.Store.MongoDB.include Metro.Store.MongoDB.Configuration
Metro.Store.MongoDB.include Metro.Store.MongoDB.Database
Metro.Store.MongoDB.include Metro.Store.MongoDB.Finders
Metro.Store.MongoDB.include Metro.Store.MongoDB.Graph
Metro.Store.MongoDB.include Metro.Store.MongoDB.Inheritance
Metro.Store.MongoDB.include Metro.Store.MongoDB.Persistence
Metro.Store.MongoDB.include Metro.Store.MongoDB.Serialization

module.exports = Metro.Store.MongoDB
