File = require('pathfinder').File

Tower.Generator.Resources =  
  route: (routingCode) ->
    @log "route", routingCode
    sentinel = /\.Route\.draw do(?:\s*\|map\|)?\s*$/
    
    @inRoot ->
      @injectIntoFile 'config/routes.rb', "\n  #{routing_code}\n", after: sentinel, verbose: false
      
  generate: (type) ->
    options =
      program:          @program
      project:          @project
      user:             @user
      model:            @model
      destinationRoot:  @destinationRoot
      
    generator = new Tower.Generator[Tower.Support.String.camelize(type)](options)
    generator.run()
  
  nodeModule: (name, options = {}) ->
    
  locals: ->
    model: @model, project: @project, user: @user
    
  builtAttribute: (name, type = "string") ->
    name:       name
    type:       type
    humanName:  _.humanize(name)
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
  
  buildModel: (name, namespace, argv) ->
    name                 = Tower.Support.String.camelize(name, true)
    namespace            = namespace
    className            = Tower.Support.String.camelize(name)
    pluralClassName      = Tower.Support.String.pluralize(className)
    namespacedClassName  = "#{namespace}.#{className}"
    pluralName           = Tower.Support.String.pluralize(name)
    cssName              = Tower.Support.String.parameterize(name)
    pluralCssName        = Tower.Support.String.parameterize(pluralName)
    humanName            = _.titleize(className)
    attributes = []
    
    for pair in argv
      pair  = pair.split(":")
      continue unless pair.length > 1
      attr  = pair[0]
      type  = Tower.Support.String.camelize(pair[1] || pair[0], true)
      attributes.push @builtAttribute(attr, Tower.Support.String.camelize(type))
    
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
    
  buildProject: (name = @projectName) ->
    name:           name
    className:      Tower.Support.String.camelize(@program.namespace || name)
    cssName:        Tower.Support.String.parameterize(@program.namespace || name)
    pluralCssName:  Tower.Support.String.parameterize(Tower.Support.String.pluralize(@program.namespace || name))
    
  buildUser: (callback) ->
    configFile = process.env.HOME + "/.tower.json";
    
    unless File.exists(configFile)
      user = {}
      @prompt "github username", (username) =>
        user.username = username
        @prompt "email", (email) =>
          user.email  = email
          @prompt "your full name", (name) =>
            user.name = name
            databases   = ["mongodb"]
            @choose "default database", databases, (index) =>
              user.database = databases[index]
              
              File.write configFile, JSON.stringify(user, null, 2)
              
              process.nextTick ->
                callback(user)
    else
      try
        user  = JSON.parse(File.read(configFile))
      catch error
        user  = {}
      
      user.database ||= "mongodb"
      
      callback(user)

module.exports = Tower.Generator.Resources
