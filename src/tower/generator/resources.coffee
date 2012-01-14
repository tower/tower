Tower.Generator.Resources =  
  route: (routingCode) ->
    @log "route", routingCode
    sentinel = /\.Route\.draw do(?:\s*\|map\|)?\s*$/
    
    @inRoot ->
      @injectIntoFile 'config/routes.rb', "\n  #{routing_code}\n", after: sentinel, verbose: false
  
  nodeModule: (name, options = {}) ->
    
  locals: ->
    model: @model
    
  attribute: (name, type = "string") ->
    name:       name
    type:       type
    humanName:  _.titleize(name)
    fieldType:  switch type
      when "integer"                then "numberField"
      when "float", "decimal"       then "textField"
      when "time"                   then "timeSelect"
      when "datetime", "timestamp"  then "datetimeSelect"
      when "date"                   then "dateSelect"
      when "text"                   then "textArea"
      when "boolean"                then "checkBox"
      else
        "textField"
    default:    switch type
      when "integer"                        then 1
      when "float"                          then 1.5
      when "decimal"                        then "9.99"
      when "datetime", "timestamp", "time"  then Time.now.toString("db")
      when "date"                           then Date.today.toString("db")
      when "string"                         then (if name == "type" then "" else "MyString")
      when "text"                           then "MyText"
      when "boolean"                        then false
      when "references", "belongsTo"        then null
      else
        ""
  
  model: (name, namespace) ->
    return @model if @model
    
    name                 = Tower.Support.String.camelize(name, true)
    namespace            = namespace
    className            = Tower.Support.String.camelize(name)
    pluralClassName      = Tower.Support.String.pluralize(@className)
    namespacedClassName  = "#{namespace}.#{@className}"
    pluralName           = Tower.Support.String.pluralize(@name)
    cssName              = Tower.Support.String.parameterize(@name)
    pluralCssName        = Tower.Support.String.parameterize(@pluralName)
    humanName            = _.titleize(@className)
    attributes = []
    
    for pair in argv
      pair  = pair.split(":")
      name  = pair[0]
      type  = Tower.Support.String.camelize(pair[1] || pair[0], true)
      attributes.push new Tower.Generator.Attribute(name, Tower.Support.String.camelize(type))
    
    @model =
      name:                name
      namespace:           namespace
      className:           className
      pluralClassName:     pluralClassName
      namespacedClassName: namespacedClassName
      pluralName:          pluralName
      cssName:             cssName
      pluralCssName:       pluralCssName
      humanName:           humanName
      attributes:          attributes

module.exports = Tower.Generator.Resources
