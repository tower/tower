user      = null

Array.prototype.ARRAY_TO_STRING = ->
  result  = '['
  length  = @length - 1
  @forEach (item, index) ->
    result += item.toString()
    result += ', ' if (index != length)
  result += ']'
  result

describe "Tower.ModelPersistence", ->
  describe 'new', ->
    test '#isNew', ->
      user = new App.User
      assert.ok user.get('isNew')

  describe 'create', ->
    test 'with no attributes (missing required attributes)', (done) ->
      App.User.insert (error, record) =>
        assert.deepEqual record.errors, { "firstName": ["firstName can't be blank"] }
        
        App.User.count (error, count) =>
          assert.equal count, 0
          
          done()

    test 'with valid attributes', (done) ->
      App.User.insert firstName: "Lance", (error, record) =>
        assert.deepEqual record.errors, {}
        
        assert.equal record.get('firstName'), "Lance"
        
        App.User.count (error, count) =>
          assert.equal count, 1
          
          done()

    test 'with multiple with valid attributes as array', (done) ->
      App.User.insert [{firstName: "Lance"}, {firstName: "Dane"}], (error, records) =>
        assert.equal records.length, 2
        
        assert.equal records[0].get('firstName'), "Lance"
        assert.equal records[1].get('firstName'), "Dane"
        
        App.User.count (error, count) =>
          assert.equal count, 2
      
          done()

    test 'with multiple with valid attributes as arguments', (done) ->
      App.User.insert {firstName: "Lance"}, {firstName: "Dane"}, (error, records) =>
        assert.equal records.length, 2

        App.User.count (error, count) =>
          assert.equal count, 2

          done()
  
  describe '#save', ->
    test 'throw error if readOnly', (done) ->
      user = new App.User({}, readOnly: true)
      assert.throws(
        -> user.save()
        "Record is read only"
      )
      done()

  describe 'update', ->
    beforeEach (done) ->
      attributes = []
      attributes.push firstName: "Lance"
      attributes.push firstName: "Dane"
      App.User.insert(attributes, done)

    test 'update string property', (done) ->
      App.User.update {firstName: "John"}, (error) =>
        App.User.all (error, users) =>
          assert.equal users.length, 2
          
          for user in users
            assert.equal user.get("firstName"), "John"
    
          done()

    test 'update matching string property', (done) ->
      App.User.where(firstName: "Lance").update {firstName: "John"}, (error, records) =>
        App.User.where(firstName: "John").count (error, count) =>
          assert.equal count, 1
          
          done()

  describe '#update', ->
    beforeEach (done) ->
      App.User.insert firstName: "Lance", (error, record) =>
        user = record
        App.User.insert(firstName: "Dane", done)
    
    test 'update string property with updateAttributes', (done) ->
      user.updateAttributes firstName: "John", (error) =>
        assert.equal user.get("firstName"), "John"
        
        App.User.find user.get('id'), (error, user) =>
          assert.equal user.get('firstName'), 'John'
          
          done()

    test 'update string property with save', (done) ->
      assert.equal user.get('isDirty'), false
    
      user.set "firstName", "John"
      
      assert.equal user.get('isDirty'), true
      assert.deepEqual user.get('changes'), firstName: ['Lance', 'John']
      
      user.save (error) =>
        assert.equal user.get("firstName"), "John", 'Assert name'
        assert.equal user.get('isDirty'), false
        assert.deepEqual user.get('changes'), {}
        
        done()

  describe 'destroy', ->
    beforeEach (done) ->
      App.User.insert firstName: "Lance!!!", (error, result) =>
        user = result
        App.User.insert(firstName: "Dane", done)
    
    test 'destroy all', (done) ->
      App.User.count (error, count) =>
        assert.equal count, 2
        
        App.User.destroy (error) =>
          App.User.count (error, count) =>
            assert.equal count, 0
            
            done()

    test 'destroy matching', (done) ->
      App.User.count (error, count) =>
        assert.equal count, 2

        App.User.where(firstName: "Dane").destroy (error) =>
          App.User.count (error, count) =>
            assert.equal count, 1

            done()
            
  describe 'reload', ->
    test 'reload'
