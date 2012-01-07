require '../../config'

describe 'Tower.Model', ->
  beforeEach ->
    spec.resetUserStore()
    
  describe 'hierarchical', ->
    it 'should build tree', ->
      parent  = Category.create()
      childA  = parent.children().create()
      childB  = parent.children().create()
      
      expect(parent.parentId).toEqual undefined
      expect(childA.parentId).toEqual 0
      expect(childB.parentId).toEqual 0
      expect(parent.children().all()).toEqual [childA, childB]
      
      #console.log parent
      #console.log childA
      #console.log childB
      #console.log parent.children.all()
      #
      #console.log childB.parent
