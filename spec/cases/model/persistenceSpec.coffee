require '../../config'

describe 'Tower.Model', ->
  describe 'updating', ->
    beforeEach ->
      spec.resetUserStore()
      User.deleteAll()
      Page.deleteAll()
      Post.deleteAll()
      
    it 'should $push values if the attribute is defined as an array when I updateAttributes', ->
      user = User.create(firstName: "music")
      expect(user.postIds.length).toEqual 0
      user.posts().create(title: "A Post")
      expect(user.postIds.length).toEqual 1
      user.updateAttributes postIds: 2
      expect(user.postIds.length).toEqual 2
