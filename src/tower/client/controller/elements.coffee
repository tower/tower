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
    
    # @example
    #   @on 'click .item', 'add', id: true
    #   @on 'click .item', 'add', id: 'data-id'
    #   @on 'click .item', 'add', effect: 'hide'
    #   @on 'click .item', 'add', effect: opacity: 0.25
    #   @on 'click .item', 'add', elements: items: '.items'
    #   @on 'click', 'add', selector: '.item'
    clickHandler: (name, handler, options = {}) ->
      elementObject = options.elements
      delete options.elements
      effect        = options.effect
      delete options.effect
      
      for key, value of options
        options[key] = "data-#{key}" unless typeof value == 'string'
        
      $(@dispatcher).on name, options.target, (event) =>
        element = $(event.currentTarget)
        
        params  = {}
        
        for key, value of options
          value = element.attr(value)
          params[key] = value if value?
          
        if elementObject
          elements = {}
          for key, value of elementObject
            elements[key] = element.find(value)
            
        if effect
          if typeof effect == 'string'
            element[effect]()
          else
            element.animate(effect)
        
        @_dispatch event, handler, params

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
