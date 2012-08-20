Tower.Router = Ember.Router.extend
  initialState: 'root'
  # @todo 'history' throws an error in ember
  location:     Ember.HistoryLocation.create()
  root:         Ember.Route.create
    route: '/'
    index: Ember.Route.create(route: '/')
    eventTransitions:
      'showRoot': 'root.index'
    showRoot: Ember.State.transitionTo('root.index')

  # Don't need this with the latest version of ember.
  handleUrl: (url, params = {}) ->
    route = Tower.NetRoute.findByUrl(url)

    if route
      params = route.toControllerData(url, params)
      Tower.router.transitionTo(route.state, params)
    else
      console.log "No route for #{url}"

  # createStatesByRoute(Tower.router, 'posts.show.comments.index')
  createControllerActionState: (name, action, route) ->
    name = _.camelize(name, true) #=> postsController

    # @todo tmp hack
    if action == 'show' || action == 'destroy' || action == 'update'
      route += ':id'
    else if action == 'edit'
      route += '/:id/edit'

    # isIndexActive, isShowActive
    # actionMethod  = "#{action}#{_.camelize(name).replace(/Controller$/, '')}"
    # 
    # Tower.router.indexPosts = Ember.State.transitionTo('root.posts.index')
    # Need to think about this more...
    # Tower.router[actionMethod] = Ember.State.transitionTo("root.#{_.camelize(name, true).replace(/Controller$/, '')}.#{action}")

    Ember.Route.create
      route: route

      # So you can give it a post and it returns the attributes
      #
      # @todo
      serialize: (router, context) ->
        attributes  = context.toJSON() if context && context.toJSON
        attributes || context # i.e. "params"

      deserialize: (router, params) ->
        params

      enter: (router, transition) ->
        @_super(router, transition)

        console.log "enter: #{@name}" if Tower.debug
        controller  = Ember.get(Tower.Application.instance(), name)

        if controller
          if @name == controller.collectionName
            controller.enter()
          else
            controller.enterAction(action)

      connectOutlets: (router, params) ->
        console.log "connectOutlets: #{@name}" if Tower.debug
        controller  = Ember.get(Tower.Application.instance(), name)

        # controller.call(router, @, params)
        # if @action == state.name, call action
        # else if state.name == @collectionName call @enter
        if controller
          return if @name == controller.collectionName
          controller.call(router, params)

        true

      exit: (router, transition) ->
        @_super(router, transition)

        console.log "exit: #{@name}" if Tower.debug
        controller  = Ember.get(Tower.Application.instance(), name)

        if controller
          if @name = controller.collectionName
            controller.exit()
          else
            controller.exitAction(action)

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
    controllerName = route.controller.name

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
        routeName = '/'

        # @todo tmp hack
        if r[i] == r[0] || r[i] == 'new'
          routeName += r[i]

        # @todo tmp hack
        # Basically, create methods like `showUser` and `indexUsers`, which
        # will call Ember.State.transitionTo('users.show'), pass the correct context, etc.
        if !controllerName.toLowerCase().match(r[i])
          methodName = r[i] + _.singularize(_.camelize(controllerName.replace('Controller', '')))
          Tower.router.root[methodName] = Ember.State.transitionTo(r.join('.'))
          Tower.router.root.eventTransitions[methodName] = r.join('.')
        
        s = @createControllerActionState(controllerName, r[i], routeName)
        state.setupChild(states, r[i], s)
        state = s

      i++

    undefined

# @todo tmp workaround b/c ember will initialize url right when router is created
Tower.router = Tower.Router.PrototypeMixin.mixins[Tower._router.PrototypeMixin.mixins.length - 1].properties
