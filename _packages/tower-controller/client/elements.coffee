Tower.ControllerElements =
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
