require '../../config'

user      = null

describeWith = (store) ->
  describe "Tower.Model.Callbacks (Tower.Store.#{store.name})", ->
    beforeEach (done) ->
      App.User.store(new store(name: "users", type: "App.User"))
      
      done()

    #describe 'create', ->
    #  test 'should have callback if instantiate: false', (done) ->
    #    done()
      
describeWith Tower.Store.Memory
#describeWith Tower.Store.MongoDB
