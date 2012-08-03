Tower.Controller.reopenClass extended: ->
  object    = {}
  name      = @className()
  camelName = _.camelize(name, true)

  object[camelName] = Ember.computed(->
    Tower.Application.instance()[name].create()
  ).cacheable()

  Tower.Application.instance().reopen(object)

  Tower.NetConnection.controllers.push(camelName)

  @

  instance: ->
    Tower.Application.instance().get(camelName)

Tower.Controller.include Tower.ControllerActions
Tower.Controller.include Tower.ControllerElements
Tower.Controller.include Tower.ControllerEvents
Tower.Controller.include Tower.ControllerHandlers
Tower.Controller.include Tower.ControllerInstrumentation
Tower.Controller.include Tower.ControllerStates
