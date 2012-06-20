require './controller/actions'
require './controller/elements'
require './controller/events'
require './controller/handlers'
require './controller/instrumentation'
require './controller/states'

Tower.Controller.reopenClass extended: ->
  object    = {}
  name      = @className()
  camelName = _.camelize(name, true)

  object[camelName] = Ember.computed(->
    Tower.Application.instance()[name].create()
  ).cacheable()

  Tower.Application.instance().reopen(object)

  Tower.Net.Connection.controllers.push(camelName)

  @

  instance: ->
    Tower.Application.instance().get(camelName)

Tower.Controller.include Tower.Controller.Actions
Tower.Controller.include Tower.Controller.Elements
Tower.Controller.include Tower.Controller.Events
Tower.Controller.include Tower.Controller.Handlers
Tower.Controller.include Tower.Controller.Instrumentation
Tower.Controller.include Tower.Controller.States
