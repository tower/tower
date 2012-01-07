require '../../config'

describe 'Tower.Model', ->
  describe 'serialization', ->
    beforeEach ->
      spec.resetUserStore()

      @user = new User(firstName: 'Terminator', id: 1)
      
    it 'should serialize to JSON', ->
      expected = '{"firstName":"Terminator","id":1,"createdAt":'
      expected += JSON.stringify(new Date)
      expected += ',"likes":0,"tags":[],"postIds":[]}'
      expect(@user.toJSON()).toEqual expected
      
    it 'should unmarshall from JSON', ->
      user = User.fromJSON('{"firstName":"Terminator","id":1}')[0]
      expect(user).toEqual(@user)
