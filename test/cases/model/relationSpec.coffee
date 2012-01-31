require '../../config'

class App.Parent extends Tower.Model
  @field "id", type: "Id"
  @hasMany "child", type: "Child", cache: true, counterCache: true

global.Parent = App.Parent

class App.Child extends Tower.Model
  @field "id", type: "Id"
  @hasMany "parents", cache: true, counterCache: true
  
global.Child = App.Child
  
describe 'Tower.Model.Relation', ->
  beforeEach ->
    Child.store(new Tower.Store.Memory(name: "child", type: "Child"))
    Parent.store(new Tower.Store.Memory(name: "parents", type: "Parent"))
    
  describe 'HasAndBelongsToMany', ->
    test 'defaults to blank array', ->
      parent = Parent.create(id: 1)
      expect(parent.child().all()).toEqual []
      
    test 'create from parent', ->
      parent  = Parent.create(id: 1)
      child   = parent.child().create(id: 10)
      expect(child.parentIds).toEqual [1]
      expect(parent.childIds).toEqual [10]
      
      child   = parent.child().create(id: 9)
      expect(parent.childIds).toEqual [10, 9]
      
      child.parents().create(id: 20)
      expect(child.parentIds).toEqual [1, 20]
      
      child = Child.last()
      
      expect(child.parentsCount).toEqual 2
      expect(child.parents().toCriteria().query).toEqual { childIds: { $in: [9] } }
      
      expect(child.parents().count()).toEqual 2
      
      parent = Parent.first()
      
      expect(parent.child().toCriteria().query).toEqual { parentIds: { $in: [1] } }
      
      expect(parent.child().count()).toEqual 2