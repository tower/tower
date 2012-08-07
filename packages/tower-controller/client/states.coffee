# @todo
# @concern
#
# Used to bind menu items to controller states
Tower.ControllerStates =
  # This should be configured from the @belongsTo in controllers.
  parentController: ->
    Tower.Application.instance().get('applicationController')

  findEmberView: (options) ->
    if options.view
      options.view
    else
      App.get(_.camelize(options.template))

  renderWithEmber: (options) ->
    outletOptions =
      outletName: options.outlet || 'view' # default value in ember
      viewClass:  @findEmberView(options)
      context:    options.data || @#get('content')

    @parentController().connectOutlet(outletOptions)
