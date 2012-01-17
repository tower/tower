require '../../config'

user      = null

describe 'Tower.Model.Scope', ->
  beforeEach ->
    User.store(new Tower.Store.Memory(name: "users", type: "User"))
    user = User.create(id: 1, firstName: "Lance")
    User.create(id: 2, firstName: "Dane")

  