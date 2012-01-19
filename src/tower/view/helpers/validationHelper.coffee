Tower.View.ValidationHelper =    
  success: ->
    @level 1, =>
      @redirectTo @urlFor("admin", "categories")
    
  failure: (error) ->
    if error
      @flashError(error)
    else
      @invalidate()
      
  invalidate: ->
    element = $("##{@resourceName}-#{@elementName}")
    
    for attribute, errors of @resource.errors
      field = $("##{@resourceName}-#{attribute}-field")
      if field.length
        field.css("background", "yellow")
        $("input", field).after("<output class='error'>#{errors.join("\n")}</output>")