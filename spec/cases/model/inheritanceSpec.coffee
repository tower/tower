require '../../config'

describe 'Tower.Model', ->
  beforeEach ->
    spec.resetUserStore()
      
  describe 'inheritance', ->
    beforeEach ->
      spec.resetUserStore()
      User.create(firstName: 'Terminator', id: 1, createdAt: new Date())
      User.create(firstName: 'Terminator 2', id: 2, createdAt: require('moment')().subtract('days', 20))
      User.create(firstName: 'Terminator 3', id: 3, createdAt: new Date())
    
    it 'should have scoped by type', ->
      expect(User.thisWeek.all().length).toEqual 2
      
    it 'should have a default', ->
      expect((new User).createdAt).toEqual new Date
