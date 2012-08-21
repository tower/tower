class <%= controller.namespace %>.<%= controller.className %> extends Tower.Controller
  @scope 'all'

  # @todo refactor
  destroy: ->
    @get('resource').destroy()
