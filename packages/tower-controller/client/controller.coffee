Tower.Controller.reopenClass extended: ->
  object    = {}
  name      = @className()
  camelName = Tower._.camelize(name, true)

  object[camelName] = Ember.computed(->
    Tower.router.get(camelName)
    # Tower.Application.instance()[name].create()
  ).cacheable()

  # @todo make this awesome
  @reopen(resourceControllerBinding: "Tower.router.#{_.singularize(camelName.replace(/Controller$/, ''))}Controller")

  Tower.Application.instance().reopen(object)

  Tower.NetConnection.controllers.push(camelName)

  @

  instance: ->
    Tower.Application.instance().get(camelName)
