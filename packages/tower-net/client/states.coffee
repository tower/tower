Tower.router = Ember.Router.create
  initialState: 'root'
  location: 'history'

  root: Ember.State.create(route: '/')

  # Don't need this with the latest version of ember.
  handleUrl: (url, params = {}) ->
    route = Tower.Net.Route.findByUrl(url)

    if route
      params = route.toControllerData(url, params)
      Tower.stateManager.transitionTo(route.state, params)
    else
      console.log "No route for #{url}"

  # createStatesByRoute(Tower.stateManager, 'posts.show.comments.index')
  createControllerActionState: (name, action) ->
    name = _.camelize(name, true) #=> postsController

    # isIndexActive, isShowActive
    # actionMethod  = "#{action}#{_.camelize(name).replace(/Controller$/, '')}"
    # 
    # Tower.stateManager.indexPosts = Ember.State.transitionTo('root.posts.index')
    # Need to think about this more...
    # Tower.stateManager[actionMethod] = Ember.State.transitionTo("root.#{_.camelize(name, true).replace(/Controller$/, '')}.#{action}")

    Ember.State.create
      enter: (router, transition) ->
        @_super(router, transition)

        console.log "enter: #{@name}" if Tower.debug
        controller  = Ember.get(Tower.Application.instance(), name)

        controller.enter(action) if controller

      connectOutlets: (router, params) ->
        console.log "connectOutlets: #{@name}" if Tower.debug
        controller  = Ember.get(Tower.Application.instance(), name)

        controller.call(router, params) if controller

      exit: (router, transition) ->
        @_super(router, transition)

        console.log "exit: #{@name}" if Tower.debug
        controller  = Ember.get(Tower.Application.instance(), name)

        controller.exit(action) if controller

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
