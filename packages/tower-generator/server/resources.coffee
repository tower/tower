File  = require('pathfinder').File
fs    = require 'fs'

# @mixin
Tower.GeneratorResources =
  generate: (type) ->
    options =
      program:          @program
      app:              @app
      user:             @user
      model:            @model
      view:             @view
      controller:       @controller
      destinationRoot:  @destinationRoot

    generator = @constructor.buildGenerator(type)
    generator = new generator(options)
    generator.run()

  nodeModule: (name, options = {}) ->

  locals: ->
    model:      @model
    view:       @view
    controller: @controller
    app:        @app
    user:       @user

  builtAttribute: (name, type = 'string') ->
    name:       name
    type:       switch type.toLowerCase()
      when 'text' then 'String'
      else
        Tower.SupportString.camelize(type)

    humanName:  _.humanize(name)

    fieldType:  switch type
      when 'integer'                    then 'number'
      when 'float', 'decimal', 'string' then 'string'
      when 'time'                       then 'time'
      when 'datetime', 'timestamp'      then 'datetime'
      when 'date'                       then 'date'
      when 'text'                       then 'text'
      when 'boolean'                    then 'checkbox'
      else
        'string'

    default:    switch type
      when 'integer'                        then 0
      when 'array' then []
      else
        null

    value: switch type
      when 'integer' then 0
      when 'array' then []
      else
        "A #{name}"

  buildRelation: (type, className) ->
    name:       Tower.SupportString.camelize(className, true)
    type:       type
    humanName:  _.humanize(className)

  buildModel: (name, appNamespace, argv = []) ->
    namespaces            = name.split('/')
    name                  = namespaces.pop()
    name                  = Tower.SupportString.camelize(name, true)
    className             = Tower.SupportString.camelize(name)
    classNamePlural       = Tower.SupportString.pluralize(className)
    namespacedClassName   = "#{appNamespace}.#{className}"
    namePlural            = Tower.SupportString.pluralize(name)
    paramName             = Tower.SupportString.parameterize(name)
    paramNamePlural       = Tower.SupportString.parameterize(namePlural)
    humanName             = _.humanize(className)
    humanNamePlural       = _.pluralize(humanName)
    attributes            = []
    relations             = []

    for pair in argv
      pair  = pair.split(':')
      continue unless pair.length > 1
      key   = pair[0]
      type  = Tower.SupportString.camelize(pair[1] || "String", true)

      if key.match(/(belongsTo|hasMany|hasOne)/)
        relations.push @buildRelation(key, Tower.SupportString.camelize(type))
      else
        attributes.push @builtAttribute(key, Tower.SupportString.camelize(type))

    name:                 name
    namespace:            appNamespace
    className:            className
    classNamePlural:      classNamePlural
    namespacedClassName:  namespacedClassName
    namePlural:           namePlural
    paramName:            paramName
    paramNamePlural:      paramNamePlural
    humanName:            humanName
    humanNamePlural:      humanNamePlural
    attributes:           attributes
    relations:            relations
    namespacedDirectory:  namespaces.join('/')
    viewDirectory:        namespaces.join('/') + "/#{namePlural}"
    namespaced:           _.map(namespaces, (n) -> Tower.SupportString.camelize(n)).join('.')

  buildApp: (name = @appName) ->
    @program.namespace ||= Tower.namespace()
    name:             name
    namespace:        Tower.SupportString.camelize(@program.namespace)
    paramName:        Tower.SupportString.parameterize(name)
    paramNamePlural:  Tower.SupportString.parameterize(Tower.SupportString.pluralize(name))
    session:          @generateRandom('hex')
    year:             (new Date).getFullYear()
    directory:        name
    isStatic:         true

  buildView: (name) ->
    name = _.map(name.split('/'), (n) -> Tower.SupportString.camelize(n, true)).join('/')
    namespace:  name
    directory:  Tower.SupportString.pluralize(name)

  buildController: (name) ->
    namespaces  = name.split('/')
    className   = Tower.SupportString.pluralize(Tower.SupportString.camelize(namespaces[namespaces.length - 1])) + 'Controller'
    if namespaces.length > 1
      namespaces = namespaces[0..-2]
      directory   = _.map(namespaces, (n) -> Tower.SupportString.camelize(n, true)).join('/')
      namespace   = @app.namespace + '.' + _.map(namespaces, (n) -> Tower.SupportString.camelize(n)).join('.')
    else
      namespace   = @app.namespace
      directory   = ''

    namespace:  namespace
    className:  className
    directory:  directory
    name:       Tower.SupportString.camelize(className, true)
    namespaced: directory != ''

  generateRandom: (code = 'hex') ->
    crypto  = require('crypto')
    uuid    = require('node-uuid')
    hash    = crypto.createHash('sha1')
    hash.update(uuid.v4())
    hash.digest(code)

  # automatically parse this stuff out from ~/.gitconfig
  buildUser: (callback) ->
    gitFile     = "#{process.env.HOME}/.gitconfig"
    gitConfig   = {}
    user        = {}

    try
      if File.exists(gitFile)
        lines     = File.read(gitFile).split('\n')
        for line in lines
          if line.charAt(0) != '#' && line.match(/\S/)
            if line.match(/^\[(.*)\]$/)
           	  variable = RegExp.$1
           	else
           	  line  = line.split('=')
           	  key   = line[0].trim()
           	  value = line[1].trim()
           	  gitConfig[variable] ||= {}
           	  gitConfig[variable][key] = value

      # @todo refactor to underscore.blank
      user.name     = if gitConfig.user && gitConfig.user.name then gitConfig.user.name else 'username'
      user.email    = if gitConfig.user && gitConfig.user.email then gitConfig.user.email else 'user@example.com'
      user.username = if gitConfig.github && gitConfig.github.user then gitConfig.github.user else 'User'
    catch error
      @

    user.name ||= 'username'
    user.email ||= 'user@example.com'
    user.username ||= 'User'

    user.database   = 'mongodb'

    callback(user) if callback

    user

module.exports = Tower.GeneratorResources
