###
describe 'Tower.Store.Neo4j', ->
  class App.NeoModel extends Tower.Model
    @store Tower.Store.Neo4j
    
    @field 'firstName'
    
  before (done) =>
    Tower.Store.Neo4j.initialize(done)
  
  test 'create node', (done) ->
    App.NeoModel.create firstName: 'A Node!', (error, record) =>
      assert.ok record
      assert.equal record.get('firstName'), 'A Node!'
      # assert.ok record.get('id')
      done()
      
  describe 'find', ->
    beforeEach (done) ->
      App.NeoModel.create firstName: 'A Node!', done
        
    test 'all nodes', (done) ->
      App.NeoModel.all (error, records) =>
        console.log records
        
        done()
###