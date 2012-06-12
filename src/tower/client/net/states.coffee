Tower.stateManager = Ember.StateManager.create
  initialState: 'root'
  root: Ember.State.create()

  handleUrl: (url, params = {}) ->
    route = Tower.Net.Route.findByUrl(url)

    if route
      params = route.toControllerData(url, params)
      Ember.set(@, 'params', params)
      Tower.stateManager.goToState(route.state)
    else
      console.log "No route for #{url}"

  # createStatesByRoute(Tower.stateManager, 'posts.show.comments.index')
  createControllerActionState: (name, action) ->
    name = _.camelize(name, true) #=> postsController
    # isIndexActive, isShowActive
    booleanName = "is#{_.camelize(action)}Active"

    Ember.State.create
      enter: (manager, transition) ->
        @_super(manager, transition)

        console.log "enter: #{@name}" if Tower.debug
        app         = Tower.Application.instance() #=> App
        controller  = Ember.get(app, name)

        Ember.changeProperties ->
          controller.set('isActive', true)
          controller.set(booleanName, true)

        controller.format = 'html'
        controller.params = Ember.get(manager, 'params')

        if controller
          controllerAction = controller[action]
          switch typeof controllerAction
            when 'object'
              if controllerAction.enter
                controllerAction.enter.call(controller)
            when 'function'
              controllerAction.call(controller)

        delete controller.params

      exit: (manager, transition) ->
        @_super(manager, transition)

        console.log "exit: #{@name}" if Tower.debug

        app         = Tower.Application.instance() #=> App
        controller  = Ember.get(app, name)

        Ember.changeProperties ->
          controller.set('isActive', false)
          controller.set(booleanName, false)

        if controller
          controllerAction = controller[action]
          switch typeof controllerAction
            when 'object'
              if controllerAction.exit
                controllerAction.exit.call(controller)

  insertRoute: (route) ->
    if route.state
      path = route.state
    else
      path = []
      route.path.replace /\/([^\/]+)/g, (_, $1) ->
        path.push($1.split('.')[0])

      path = path.join('.')

    return undefined if !path || path == ""

    r       = path.split('.')
    state   = @

    i       = 0
    n       = r.length

    while i < n
      states = Ember.get(state, 'states')

      if !states
        states = {}
        Ember.set(state, 'states', states)

      s = Ember.get(states, r[i])
      if s
        state = s
      else
        s = @createControllerActionState(route.controller.name, r[i])
        state.setupChild(states, r[i], s)
        state = s

      i++

    undefined
