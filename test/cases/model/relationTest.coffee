require '../../config'

class App.Parent extends Tower.Model
  @field "id", type: "Id"
  @hasMany "child", type: "Child", cache: true, counterCache: true

global.Parent = App.Parent

class App.Child extends Tower.Model
  @field "id", type: "Id"
  @hasMany "parents", cache: true, counterCache: true
  
global.Child = App.Child

describeWith = (store) ->
  describe 'Tower.Model.Relation', ->
    beforeEach ->
      Child.store(new store(name: "child", type: "Child"))
      Parent.store(new store(name: "parents", type: "Parent"))
    
    describe 'HasAndBelongsToMany', ->
      test 'defaults to blank array', (done) ->
        sinon.spy Parent, "create"
      
        Parent.create id: 1, (error, parent) =>
          assert.deepEqual {id: 1}, Parent.create.getCall(0).args[0]
        
          parent.child().all (error, children) =>
            assert.deepEqual children, []
          
            done()
      
      test 'create from parent', (done) ->
        parent  = Parent.create(id: 1)
        child   = parent.child().create(id: 10)
      
        assert.deepEqual child.parentIds, [1]
        assert.deepEqual parent.childIds, [10]
      
        child   = parent.child().create(id: 9)
        assert.deepEqual parent.childIds, [10, 9]
      
        done()
      
      test 'create from child', ->    
        parent  = Parent.create(id: 1)
        parent.child().create(id: 10)
        child   = parent.child().create(id: 9)
      
        child.parents().create(id: 20)
        assert.deepEqual child.parentIds, [1, 20]
      
        child = Child.last()
      
        assert.equal child.parentCount, 2
        assert.deepEqual child.parents().toQuery().conditions, { childIds: { $in: [9] } }
        assert.equal child.parents().count(), 2
      
        parent = Parent.first()
      
        assert.deepEqual parent.child().toQuery().conditions, { parentIds: { $in: [1] } }
      
        assert.equal parent.child().count(), 2

describeWith(Tower.Store.Memory)