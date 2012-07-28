window.designer ||= new DesignIO('<%= app.name %>', port: 4181)

mocha.setup 'bdd'

global.assert = chai.assert
global.expect = chai.expect
global.test   = it
global.__flash_getWindowLocation  = null
global.__flash_getTopLocation     = null

$ ->
  # mocha.globals ['__flash_getWindowLocation', '__flash_getTopLocation']
  # mocha.run()
