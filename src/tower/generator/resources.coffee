exec  = require("child_process").exec
File  = require("pathfinder").File
fs    = require 'fs'

Tower.Generator.Resources =  
  route: (routingCode) ->
    # @log "route", routingCode
    
    @inRoot =>
      if @controller.namespaced
        # @todo, add namespaces and such
        @injectIntoFile "config/routes.coffee", "  #{routingCode}\n", after: /\.Route\.draw ->\n/, duplicate: false
      else
        @injectIntoFile "config/routes.coffee", "  #{routingCode}\n", after: /\.Route\.draw ->\n/, duplicate: false
        
  asset: (path, options) ->
    @inRoot =>
      @injectIntoFile "config/assets.coffee", "      \"#{path}\"\n", after: /application: *\[[^\]]+\n/g
      
  inRoot: (block) ->
    @inside ".", block
    
  generate: (type) ->
    options =
      program:          @program
      app:              @app
      user:             @user
      model:            @model
      view:             @view
      controller:       @controller
      destinationRoot:  @destinationRoot
    generator = new Tower.Generator[Tower.Support.String.camelize(type) + "Generator"](options)
    generator.run()
  
  nodeModule: (name, options = {}) ->
    
  locals: ->
    model:      @model
    view:       @view
    controller: @controller
    app:        @app
    user:       @user
    
  builtAttribute: (name, type = "string") ->
    name:       name
    type:       switch type.toLowerCase()
      when "text" then "String"
      else
        Tower.Support.String.camelize(type)
        
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
  
  buildModel: (name, appNamespace, argv) ->
    namespaces            = name.split("/")
    name                  = namespaces.pop()
    name                  = Tower.Support.String.camelize(name, true)
    className             = Tower.Support.String.camelize(name)
    classNamePlural       = Tower.Support.String.pluralize(className)
    namespacedClassName   = "#{appNamespace}.#{className}"
    namePlural            = Tower.Support.String.pluralize(name)
    paramName             = Tower.Support.String.parameterize(name)
    paramNamePlural       = Tower.Support.String.parameterize(namePlural)
    humanName             = _.titleize(className)
    attributes            = []
    relations             = []
    
    for pair in argv
      pair  = pair.split(":")
      continue unless pair.length > 1
      key   = pair[0]
      type  = Tower.Support.String.camelize(pair[1] || "String", true)
      
      if key.match(/(belongsTo|hasMany|hasOne)/)
        relations.push @buildRelation(key, Tower.Support.String.camelize(type))
      else
        attributes.push @builtAttribute(key, Tower.Support.String.camelize(type))
    
    name:                 name
    namespace:            appNamespace
    className:            className
    classNamePlural:      classNamePlural
    namespacedClassName:  namespacedClassName
    namePlural:           namePlural
    paramName:            paramName
    paramNamePlural:      paramNamePlural
    humanName:            humanName
    attributes:           attributes
    relations:            relations
    namespacedDirectory:  namespaces.join("/")
    viewDirectory:        namespaces.join("/") + "/#{namePlural}"
    namespaced:           _.map(namespaces, (n) -> Tower.Support.String.camelize(n)).join(".")
    
  buildApp: (name = @appName) ->
    @program.namespace ||= Tower.namespace()
    name:             name
    namespace:        Tower.Support.String.camelize(@program.namespace)
    paramName:        Tower.Support.String.parameterize(@program.namespace)
    paramNamePlural:  Tower.Support.String.parameterize(Tower.Support.String.pluralize(@program.namespace))
    session:          @generateRandom("hex")
    year:             (new Date).getFullYear()
    directory:        name
    
  buildView: (name) ->
    name = _.map(name.split("/"), (n) -> Tower.Support.String.camelize(n, true)).join("/")
    namespace:  name
    directory:  Tower.Support.String.pluralize(name)
    
  buildController: (name) ->
    namespaces  = name.split("/")
    className   = Tower.Support.String.pluralize(Tower.Support.String.camelize(namespaces[namespaces.length - 1])) + "Controller"
    if namespaces.length > 1
      namespaces = namespaces[0..-2]
      directory   = _.map(namespaces, (n) -> Tower.Support.String.camelize(n, true)).join("/")
      namespace   = @app.namespace + "." + _.map(namespaces, (n) -> Tower.Support.String.camelize(n)).join(".")
    else
      namespace   = @app.namespace
      directory   = ""
      
    namespace:  namespace
    className:  className
    directory:  directory
    name:       Tower.Support.String.camelize(className, true)
    namespaced: directory != ""
    
  generateRandom: (code = "hex") ->
    crypto  = require('crypto')
    hash    = crypto.createHash("sha1")
    hash.update(crypto.randomBytes(64).toString())
    hash.digest(code)
  
  # automatically parse this stuff out from ~/.gitconfig
  buildUser: (callback) ->
    gitFile     = "#{process.env.HOME}/.gitconfig"
    gitConfig   = {}
    user        = {}
    
    try
      if File.exists(gitFile)
        lines     = File.read(gitFile).split("\n")
        for line in lines
          if line.charAt(0) != "#" && line.match(/\S/)
            if line.match(/^\[(.*)\]$/)
           	  variable = RegExp.$1
           	else
           	  line  = line.split("=")
           	  key   = line[0].trim()
           	  value = line[1].trim()
           	  gitConfig[variable] ||= {}
           	  gitConfig[variable][key] = value
      
      # refactor to underscore.blank
      user.name     = if gitConfig.user && gitConfig.user.name then gitConfig.user.name else "username"
      user.email    = if gitConfig.user && gitConfig.user.email then gitConfig.user.email else "example@example.com"
      user.username = if gitConfig.github && gitConfig.github.user then gitConfig.github.user else "User"
    catch error
      @
    
    user.database   = "mongodb"
    
    callback(user) if callback
    
    user

module.exports = Tower.Generator.Resources
