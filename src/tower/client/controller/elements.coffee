Tower.Controller.Elements =
  ClassMethods:
    # @extractElements $(".item a"), find: {meta: "span small"}, closest: {title: ".item h1"}
    extractElements: (target, options = {}) ->
      result = {}

      for method, selectors of options
        for key, selector of selectors
          result[key] = target[method](selector)

      result

    processElements: (target, options = {}) ->
      @elements = @extractElements(target, options)

    clickHandler: (name, handler, options) ->
      $(@dispatcher).on name, options.target, (event) =>
        @_dispatch event, handler

    submitHandler: (name, handler, options) ->
      $(@dispatcher).on name, options.target, (event) =>
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

    invalidForm: ->
      #element = $("##{@resourceName}-#{@elementName}")
      #
      #for attribute, errors of @resource.errors
      #  field = $("##{@resourceName}-#{attribute}-field")
      #  if field.length
      #    field.css("background", "yellow")
      #    $("input", field).after("<output class='error'>#{errors.join("\n")}</output>")

module.exports = Tower.Controller.Elements
