scope     = null
criteria  = null
user      = null

describe 'Tower.Model.Serialization', ->
  beforeEach ->
    App.User.store(Tower.Store.Memory)
    
  test "instance.toJSON", ->
    json = App.User.new(firstName: "Lance").toJSON()
    
    expected =
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
      
    for key, value of expected
      assert.deepEqual value, json[key]