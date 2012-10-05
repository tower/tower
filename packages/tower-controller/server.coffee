_ = Tower._

require './shared'
require './server/actions'
require './server/caching'
require './server/events'
require './server/flash'
require './server/net'
require './server/sockets'

Tower.Controller.include Tower.ControllerActions
Tower.Controller.include Tower.ControllerCaching
Tower.Controller.include Tower.ControllerEvents
Tower.Controller.include Tower.ControllerFlash
Tower.Controller.include Tower.ControllerNet
Tower.Controller.include Tower.ControllerSockets

Tower.Controller.reopenClass extended: ->
  object    = {}
  name      = @className()
  camelName = _.camelize(name, true)

  object[camelName] = Ember.computed(->
    Tower.Application.instance()[name].create()
  ).cacheable()

  Tower.NetConnection.controllers.push(camelName)

  Tower.NetConnection.reopen(object)

  @

require './server/renderers'
require './shared/testHelper'
