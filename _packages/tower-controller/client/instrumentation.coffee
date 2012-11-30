# @mixin
Tower.ControllerInstrumentation =
  # @todo refactor
  params: Ember.computed(->
    Tower.router.getStateMeta(Tower.router.get('currentState'), 'serialized')
  ).volatile()

  # @todo refactor
  resource: Ember.computed(->
    Tower.router.getStateMeta(Tower.router.get('currentState'), 'context') || @get(@get('resourceName'))
  ).volatile()

  enter: ->
    Ember.changeProperties =>
      @set('isActive', true)
      @set('format', 'html')

  enterAction: (action) ->
    Ember.changeProperties =>
      @set('action', action)
      @set('getFlash', @flash())
      @set(_.toStateName(action), true)

  # Called when the route for this controller is found.
  call: (router, params = {}) ->
    # @todo ember should allow this to be cached.
    router.send('stashContext', params)

    # @set('params', params)

    action = @get('action')

    @propertyDidChange('resource')

    @runCallbacks 'action', name: action, (callback) =>
      method = @[action]
      
      method = switch typeof method
        when 'object'
          method.enter
        when 'function'
          method
        else
          null

      throw new Error("Action '#{action}' is not defined properly.") unless method

      method.call(@, params, callback)

  exit: ->
    @set('isActive', false)

  exitAction: (action) ->
    Ember.changeProperties =>
      @set(Tower._.toStateName(action), false)

    method = @[action]

    method.exit.call(@) if typeof(method) == 'object' && method.exit

  clear: ->

  metadata: ->
    @constructor.metadata()
