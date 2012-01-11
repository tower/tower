require '../../config'

controller  = null
user        = null

describe 'Tower.Controller.Rendering', ->
  beforeEach ->
    controller = new TowerSpecApp.CustomController
    User.store(new Tower.Store.Memory(name: "users", type: "User"))
    user = User.create id: 1, firstName: "Lance"
    
  test 'render coffekup from template', ->
    controller.renderCoffeeKupFromTemplate()
    
    expect(controller.body).toEqual "<h1>Hello World</h1>"
    
  test 'render coffekup inline', ->
    controller.renderCoffeeKupInline()

    expect(controller.body).toEqual "<h1>I'm Inline!</h1>"
    
  test 'resourceful', ->  
    controller.params.id = 1
    controller.params.action = "show"
    controller.show()