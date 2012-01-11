require '../../config'

controller  = null
user        = null

describe 'Tower.Controller.Rendering', ->
  beforeEach ->
    controller = new TowerSpecApp.PostsController
    User.store(new Tower.Store.Memory(name: "users", type: "User"))
    user = User.create id: 1, firstName: "Lance"
    
  test 'resourceful', ->  
    controller.params.id = 1
    controller.params.action = "new"
    controller.post = new Post
    controller.new()
    console.log controller.body