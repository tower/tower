Tower.View.ElementHelper =
  addClass: (string, parts...) ->
    classes = string.split(/\ +/)
    for part in parts
      classes.push(part) if classes.indexOf(part) > -1
    classes.join(" ")
    
  # @elementId @user, "form"
  #   #=> "#user-form"
  #
  # @elementId @user, "firstName", "field"
  #   #=> "#user-first-name-field"
  elementId: ->
    "##{@elementKey(arguments...)}"
    
  elementClass: ->
    ".#{@elementKey(arguments...)}"
    
  elementKey: ->
    Tower.Support.String.parameterize(@elementNameComponents(arguments...).join("-"))
  
  # @elementName @user, "firstName"
  #   #=> "user[firstName]"
  #
  # @elementName @user, "address", "city"
  #   #=> "user[address][city]"
  elementName: ->
    result  = @elementNameComponents(arguments...)
    i       = 1
    
    for item, i in result
      result[i] = "[#{item}]"
      
    Tower.Support.String.parameterize(result.join(""))
    
  elementNameComponents: ->
    args    = Tower.Support.Array.args(arguments)
    result  = []
    
    for item in args
      switch typeof item
        when "function"
          result.push item.constructor.name
        when "string"
          result.push item
        else
          result.push item.toString()
          
    result
    
module.exports = Tower.View.ElementHelper
