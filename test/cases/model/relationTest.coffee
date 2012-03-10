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
    beforeEach (done) ->
      Child.store(new store(name: "child", type: "Child"))
      Parent.store(new store(name: "parents", type: "Parent"))
      Child.destroy =>
        Parent.destroy done
        
    afterEach ->
      try Parent.create.restore()
    
    describe 'HasAndBelongsToMany', ->
      test 'defaults to blank array', (done) ->
        sinon.spy Parent, "create"
        
        Parent.create id: 1, (error, parent) =>
          assert.deepEqual {id: 1}, Parent.create.getCall(0).args[0]
          
          parent.child().all (error, children) =>
            assert.deepEqual children, []
          
            done()
      
      test 'create from parent', (done) ->
        Parent.create id: 1, (error, parent) =>
          parent.child().create id: 10, (error, child) =>
            assert.deepEqual child.parentIds, [1]
            # same, update models that are still in memory in a normalized way!
            Parent.find 1, (error, parent) =>
              assert.deepEqual parent.childIds, [10]
            
              parent.child().create id: 9, (error, child) =>
                Parent.find 1, (error, parent) =>
                  assert.deepEqual parent.get("childIds"), [10, 9]
                
                  done()
      
      test 'create from child', (done) ->    
        parent  = Parent.create(id: 1)
        parent.child().create(id: 10)
        child   = parent.child().create(id: 9)
        
        child.parents().create(id: 20)
        # need to update the record in memory as well for mongodb!
        Child.find 9, (error, child) =>
          assert.deepEqual child.parentIds, [1, 20]
          
          assert.equal child.get("parentCount"), 2
          assert.deepEqual child.parents().toQuery().conditions, { childIds: { $in: [9] } }
          
          child.parents().count (error, count) =>
            assert.equal count, 2
            
            Parent.first (error, parent) =>
              assert.deepEqual parent.child().toQuery().conditions, { parentIds: { $in: [1] } }
              
              parent.child().count (error, count) =>
                assert.equal count, 2
          
                done()

describeWith(Tower.Store.Memory)
describeWith(Tower.Store.MongoDB)