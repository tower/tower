Tower.Controller.Handlers =
  ClassMethods:
    submitHandler2: (name, handler, options) ->
      $(@dispatcher).on name, (event) =>
        target    = $(event.target)
        form      = target.closest("form")
        action    = form.attr("action")
        method    = (form.attr("data-method") || form.attr("method")).toUpperCase()
        params    = form.serializeParams()

        params.method = method
        params.action = action

        elements  = _.extend {target: target, form: form}, {}#, @extractElements(target, options)
        
        event.data = elements: elements, params: params

        @_dispatch event, handler, event.data
        
  redirect: ->
    Tower.goTo(Tower.urlFor(arguments...))

module.exports = Tower.Controller.Handlers
