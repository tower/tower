mocha.setup(ui: 'bdd', timeout: 2000, ignoreLeaks: true)

global.assert = chai.assert
global.expect = chai.expect
global.test   = it
global.__flash_getWindowLocation  = null
global.__flash_getTopLocation     = null
# from node-validator on client...
global.event_handlers = null
global.naughty        = null

assert.isPresent = (value) ->
  assert.ok !!value

$ ->
  app = Tower.Application.instance()
  Tower.env = 'test'
  Tower.store = Tower.StoreMemory
  
  before (done) ->
    #app.initialize()
    #app.listen()
    done()

  beforeEach (done) ->
    #Tower.Application.instance().initialize()
    Tower.store.clean(done)
  #mocha.globals ["__flash_getWindowLocation", "__flash_getTopLocation"]
  unless window.mochaPhantomJS
    process.stdout ||= {}
    process.stdout.write = -> console.log(arguments...)
    mocha.run()