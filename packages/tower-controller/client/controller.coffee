_ = Tower._

Tower.Controller.reopenClass
  extended: ->
    object    = {}
    name      = @className()
    camelName = _.camelize(name, true)

    object[camelName] = Ember.computed(->
      Tower.router.get(camelName)
      # Tower.Application.instance()[name].create()
    ).cacheable().property('Tower.router.' + camelName)

    # @todo make this awesome
    @reopen(resourceControllerBinding: "Tower.router.#{_.singularize(camelName.replace(/Controller$/, ''))}Controller")

    Tower.Application.instance().reopen(object)

    Tower.NetConnection.controllers.push(camelName)

    @

  instance: ->
    Tower.Application.instance().get(_.camelize(@className(), true))
