Tower.Controller.Handlers =
  ClassMethods:
    submitHandler: (name, handler, options) ->
      $(@dispatcher).on name, (event) =>
        target    = $(event.target)
        form      = target.closest("form")
        action    = form.attr("action")
        method    = (form.attr("data-method") || form.attr("method")).toUpperCase()
        params    = form.serializeParams()
  
        params.method = method
        params.action = action
  
        elements  = _.extend {target: target, form: form}, {}#, @extractElements(target, options)
      
        @_dispatch handler, elements: elements, params: params
    
module.exports = Tower.Controller.Handlers
