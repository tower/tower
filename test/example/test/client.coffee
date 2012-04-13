window.designer ||= new DesignIO("client", port: 4181)

mocha.setup 'bdd'

global.assert = chai.assert
global.expect = chai.expect
global.test   = it
global.__flash_getWindowLocation  = null
global.__flash_getTopLocation     = null

$ ->
  app = Tower.Application.instance()
  
  before (done) ->
    app.initialize()
    done()

  beforeEach (done) ->
    Tower.Application.instance().initialize()
    done()
  #mocha.globals ["__flash_getWindowLocation", "__flash_getTopLocation"]
  mocha.run()