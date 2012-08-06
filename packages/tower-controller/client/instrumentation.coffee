# @mixin
Tower.ControllerInstrumentation =
  enter: (action) ->
    Ember.changeProperties =>
      @set('isActive', true)
      @set('action', action)
      @set(_.toStateName(action), true)
      @set('format', 'html')

  # Called when the route for this controller is found.
  call: (router, params = {}) ->
    @set('params', params)

    action = @get('action')

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

  exit: (action) ->
    Ember.changeProperties =>
      @set('isActive', false)
      @set(_.toStateName(action), false)

    method = @[action]

    method.exit.call(@) if typeof(method) == 'object' && method.exit

  clear: ->

  metadata: ->
    @constructor.metadata()