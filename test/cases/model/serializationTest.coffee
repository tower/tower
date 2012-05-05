scope     = null
criteria  = null
user      = null

describe 'Tower.Model.Serialization', ->
  beforeEach ->
    App.User.store(new Tower.Store.Memory(firstName: "users", type: "User"))
    
  test "instance.toJSON", ->
    json = App.User.new(firstName: "Lance").toJSON()
    
    assert.deepEqual json,
      id:                  undefined,
      createdAt:           undefined,
      likes:               0,
      tags:                [],
      postIds:             [],
      updatedAt:           undefined,
      firstName:           'Lance'
      rating:              2.5
      admin:               false
      cachedMembershipIds: []