require '../../config'

#Tower.Store.Neo4j.initialize()
quit = false

describe 'Tower.Store', ->
  beforeEach ->
    User.store(new Tower.Store.Neo4j(name: "users", className: "User"))
  
  afterEach ->
    User.store(new Tower.Store.Memory(name: "users", className: "User"))
