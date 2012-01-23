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
      
    generator = new Tower.Generator[Tower.Support.String.camelize(type) + "Generator"](options)
    generator.run()
  
  nodeModule: (name, options = {}) ->
    
  locals: ->
    model: @model, project: @project, user: @user
    
  builtAttribute: (name, type = "string") ->
    name:       name
    type:       switch type
      when "text" then "String"
      else
        Tower.Support.camelize(type)
        
    humanName:  _.humanize(name)
    
    fieldType:  switch type
      when "integer"                    then "number"
      when "float", "decimal", "string" then "string"
      when "time"                       then "time"
      when "datetime", "timestamp"      then "datetime"
      when "date"                       then "date"
      when "text"                       then "text"
      when "boolean"                    then "checkbox"
      else
        "string"
        
    default:    switch type
      when "integer"                        then 0
      else
        null
        
  buildRelation: (type, className) ->
    name:       Tower.Support.String.camelize(className, true)
    type:       type
    humanName:  _.humanize(className)
  
  buildModel: (name, namespace, argv) ->
    name                  = Tower.Support.String.camelize(name, true)
    namespace             = namespace
    className             = Tower.Support.String.camelize(name)
    pluralClassName       = Tower.Support.String.pluralize(className)
    namespacedClassName   = "#{namespace}.#{className}"
    pluralName            = Tower.Support.String.pluralize(name)
    cssName               = Tower.Support.String.parameterize(name)
    pluralCssName         = Tower.Support.String.parameterize(pluralName)
    humanName             = _.titleize(className)
    attributes            = []
    relations             = []
    
    for pair in argv
      pair  = pair.split(":")
      continue unless pair.length > 1
      key   = pair[0]
      type  = Tower.Support.String.camelize(pair[1] || key, true)
      
      if key.match(/(belongsTo|hasMany|hasOne)/)
        relations.push @buildRelation(key, Tower.Support.String.camelize(type))
      else
        attributes.push @builtAttribute(key, Tower.Support.String.camelize(type))
    
    name:                 name
    namespace:            namespace
    className:            className
    pluralClassName:      pluralClassName
    namespacedClassName:  namespacedClassName
    pluralName:           pluralName
    cssName:              cssName
    pluralCssName:        pluralCssName
    humanName:            humanName
    attributes:           attributes
    relations:            relations
    
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
