window.designer ||= new DesignIO("client", port: 4181)

mocha.setup(ui: 'bdd', timeout: 5000)

global.assert = chai.assert
global.expect = chai.expect
global.test   = it
global.__flash_getWindowLocation  = null
global.__flash_getTopLocation     = null
# from node-validator on client...
global.event_handlers = null
global.naughty        = null

$ ->
  app = Tower.Application.instance()
  Tower.env = "test"
  
  before (done) ->
    app.initialize()
    app.listen()
    done()

  beforeEach (done) ->
    Tower.Application.instance().initialize()
    done()
  #mocha.globals ["__flash_getWindowLocation", "__flash_getTopLocation"]
  mocha.run()