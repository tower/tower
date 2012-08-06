Tower.router = Ember.Router.create
  initialState: 'root'
  location: Ember.HistoryLocation.create() # @todo 'history' throws an error in ember

  root: Ember.Route.create(route: '/')

  # Don't need this with the latest version of ember.
  handleUrl: (url, params = {}) ->
    route = Tower.NetRoute.findByUrl(url)

    if route
      params = route.toControllerData(url, params)
      Tower.router.transitionTo(route.state, params)
    else
      console.log "No route for #{url}"

  # createStatesByRoute(Tower.router, 'posts.show.comments.index')
  createControllerActionState: (name, action) ->
    name = _.camelize(name, true) #=> postsController

    # isIndexActive, isShowActive
    # actionMethod  = "#{action}#{_.camelize(name).replace(/Controller$/, '')}"
    # 
    # Tower.router.indexPosts = Ember.State.transitionTo('root.posts.index')
    # Need to think about this more...
    # Tower.router[actionMethod] = Ember.State.transitionTo("root.#{_.camelize(name, true).replace(/Controller$/, '')}.#{action}")

    Ember.Route.create
      enter: (router, transition) ->
        @_super(router, transition)

        console.log "enter: #{@name}" if Tower.debug
        controller  = Ember.get(Tower.Application.instance(), name)

        controller.enter(action) if controller

      connectOutlets: (router, params) ->
        console.log "connectOutlets: #{@name}" if Tower.debug
        controller  = Ember.get(Tower.Application.instance(), name)

        # controller.call(router, @, params)
        # if @action == state.name, call action
        # else if state.name == @collectionName call @enter
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
    state   = @root

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
