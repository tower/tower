scope     = null
criteria  = null
user      = null

describe "Tower.Model.Scope", ->
  beforeEach (done) ->
    async.series [
      (callback) => 
        App.User.insert id: 1, firstName: "Lance", callback
      (callback) =>
        App.User.insert id: 2, firstName: "Dane", callback
    ], done
  
  test 'where(firstName: "Lance")', (done) ->
    App.User.where(firstName: "Lance").first (error, user) =>
      assert.equal user.get("firstName"), "Lance"
      
      done()

  test 'where(firstName: "=~": "c")', (done) ->
    App.User.where(firstName: "=~": "c").all (error, users) =>
      assert.equal users.length, 1
      assert.equal users[0].get("firstName"), "Lance"
      
      done()
  
  test 'where(firstName: "=~": "a").order("firstName")', (done) ->
    App.User.where(firstName: "=~": "a").order("firstName").all (error, users) =>
      assert.equal users.length, 2
      assert.equal users[0].get("firstName"), "Dane"
      
      done()

  test 'where(firstName: "=~": "a").order("firstName", "desc")', (done) ->
    App.User.where(firstName: "=~": "a").order("firstName", "desc").all (error, users) =>
      assert.equal users.length, 2
      assert.equal users[0].get("firstName"), "Lance"
      
      done()
  
  describe 'named scopes', ->
    beforeEach (done) ->
      async.series [
        (next) =>
          App.User.insert firstName: "Baldwin", likes: 10, next
        (next) =>
          App.Admin.insert firstName: "An Admin", likes: 20, next
        (next) =>
          App.Admin.insert firstName: "An Admin without likes", likes: 0, next
      ], done
  
    test 'named scopes', (done) ->
      App.User.byBaldwin().all (error, users) =>
        assert.equal users.length, 1
        assert.equal users[0].get("firstName"), "Baldwin"
      
        done()
          
    test 'subclasses and named scopes', (done) ->
      App.Admin.subclassNamedScope().all (error, users) =>
        assert.equal users.length, 1
        assert.equal users[0].get("type"), "Admin"

        done()
        
  describe 'returning cursor', ->
    test '.insert', (done) ->
      cursor = App.User.insert firstName: "Baldwin", likes: 10, (error, user) =>
        process.nextTick =>
          assert.isTrue cursor.isCursor, 'cursor instanceof Tower.Model.Cursor'
          done()
    
    test '.update', (done) ->
      cursor = App.User.update firstName: "Baldwin", (error, user) =>
        process.nextTick =>
          assert.isTrue cursor.isCursor, 'cursor instanceof Tower.Model.Cursor'
          done()
    
    test '.destroy', (done) ->
      cursor = App.User.destroy (error, user) =>
        process.nextTick =>
          assert.isTrue cursor.isCursor, 'cursor instanceof Tower.Model.Cursor'
          done()
        
  describe 'global callback', ->
    beforeEach ->
      Tower.cb = ->
        assert.ok arguments.length > 0
    
    afterEach ->
      Tower.cb = ->
    
    test '.insert', (done) ->
      App.User.insert firstName: "Baldwin", likes: 10, =>
        done()
