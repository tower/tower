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
    
    invalidForm: ->
      element = $("##{@resourceName}-#{@elementName}")
    
      for attribute, errors of @resource.errors
        field = $("##{@resourceName}-#{attribute}-field")
        if field.length
          field.css("background", "yellow")
          $("input", field).after("<output class='error'>#{errors.join("\n")}</output>")

module.exports = Tower.Controller.Elements
