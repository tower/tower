class <%= controller.namespace %>.<%= controller.className %> extends Tower.Controller
  @scope 'all'

  # @todo
  urlForEvent: (action, record) ->
    '/<%= model.namePlural %>'

  # @todo refactor
  destroy: (event) ->
    record = event.context
    record.destroy()