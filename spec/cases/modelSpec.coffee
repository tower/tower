require '../config'

describe 'Tower.Model', ->
  beforeEach ->
    User.store(new Tower.Store.Memory(name: "users", className: "TowerSpecApp.User"))
    