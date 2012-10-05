_ = Tower._
fs = require 'fs'

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
    _:          _
    printCoffeeOptions: (options = {}) ->
      result = []

      for key, value of options
        unless typeof value == 'undefined'
          value = switch _.kind(value)
            when 'NaN', 'null'
              'null'
            when 'array', 'string', 'integer', 'float', 'number', 'boolean'
              JSON.stringify(value)

          result.push("#{key}: #{value}".replace(/"/g, "'"))

      result.join(', ')

  buildAttribute: (name, type = 'string', options = {}) ->
    unless options.hasOwnProperty('default')
      defaultValue = switch type.toLowerCase()
        when 'integer' then 0
        when 'array' then []
        else
          undefined

      options.default = defaultValue unless typeof defaultValue == 'undefined'

    attribute = 
      name:       name
      options:    options
      type:       switch type.toLowerCase()
        when 'text' then 'String'
        else
          _.camelize(type)

      humanName:  _.humanize(name)

      fieldType:  switch type.toLowerCase()
        when 'integer'                    then 'number'
        when 'float', 'decimal', 'string' then 'string'
        when 'time'                       then 'time'
        when 'datetime', 'timestamp'      then 'datetime'
        when 'date'                       then 'date'
        when 'text'                       then 'text'
        when 'boolean'                    then 'checkbox'
        else
          'string'

      value: switch type
        when 'integer' then 0
        when 'array' then []
        else
          "A #{name}"

    # @todo a more robust guesser for mapping common property names to dummy data
    switch type.toLowerCase()
      when 'string'
        fakeKey = null

        if name.match(/email/i)
          fakeKey = 'email'
        else if name.match(/username|screenname|login/i)
          fakeKey = 'userName'
        else if name.match(/domain|url/)
          fakeKey = 'domainName'
        else if name.match(/^(firstName|lastName)$/)
          fakeKey = RegExp.$1
        else if name.match(/^(name|fullName)$/)
          fakeKey = 'fullName'
        else if name.match('phone')
          fakeKey = 'phone'
        else if name.match(/text|content|body/)
          fakeKey = 'paragraph'
        else if name.match(/title/)
          fakeKey = 'words'

        attribute.fakeKey = fakeKey if fakeKey
      when 'boolean'
        attribute.fakeKey = 'boolean'

    attribute

  buildRelation: (type, className, options) ->
    relation =
      name:       _.camelize(className, true)
      type:       type
      humanName:  _.humanize(className)
    relation.options = options if _.isPresent(options)
    relation

  buildModel: (name, appNamespace, argv = []) ->
    namespaces            = name.split('/')
    name                  = namespaces.pop()
    name                  = _.camelize(name, true)
    className             = _.camelize(name)
    classNamePlural       = _.pluralize(className)
    namespacedClassName   = "#{appNamespace}.#{className}"
    namePlural            = _.pluralize(name)
    paramName             = _.parameterize(name)
    paramNamePlural       = _.parameterize(namePlural)
    humanName             = _.humanize(className)
    humanNamePlural       = _.pluralize(humanName)
    attributes            = []
    relations             =
      belongsTo: []
      hasOne: []
      hasMany: []

    argv.splice(0, 3)

    for pair in argv
      # tower generate scaffold post belongsTo:user
      # belongsTo:inReplyToPost[type:post]
      rawOptions = null

      if pair.match(/\[/)
        pair = pair.replace /([^\[]+)\[(.+)/, (_, $1, $2) ->
          rawOptions = $2
          pair = $1
      else
        [pair, rawOptions] = pair.split(/\[/)

      pair  = pair.split(':')
      key   = pair[0]
      isRelation = !!key.match(/(belongsTo|hasMany|hasOne)/)
      
      if pair.length > 1
        type = pair[1]
      else
        # try and guess
        type = if key.match(/count$/i)
          'Integer'
        else if key.match(/At$/)
          'Date'
        else
          'String'

      type  = _.camelize(type || 'String', true)
      options = {}
      
      unless _.isBlank(rawOptions)
        rawOptions = rawOptions.replace(/\]$/, '').split(/,\s*/)
        
        for rawOption in rawOptions
          [optionKey, optionValue] = rawOption = rawOption.split(':')
          
          if rawOption.length == 1
            optionValue = optionKey
            if isRelation
              optionKey = 'type'
            else
              optionKey = 'default'

          optionValue = _.camelize(optionValue) if optionKey == 'type'
          try
            options[optionKey] = JSON.parse(optionValue)
          catch error
            options[optionKey] = optionValue

      rawOptions = null

      if isRelation
        relations[key].push @buildRelation(key, _.camelize(type), options)
      else
        attributes.push @buildAttribute(key, _.camelize(type), options)

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
    namespaced:           _.map(namespaces, (n) -> _.camelize(n)).join('.')

  buildApp: (name = @appName) ->
    @program.namespace ||= Tower.namespace()
    name:             name
    namespace:        _.camelize(@program.namespace)
    paramName:        _.parameterize(name)
    paramNamePlural:  _.parameterize(_.pluralize(name))
    session:          @generateRandom('hex')
    year:             (new Date).getFullYear()
    directory:        name
    isStatic:         true

  buildView: (name) ->
    name = _.map(name.split('/'), (n) -> _.camelize(n, true)).join('/')
    namespace:  name
    directory:  _.pluralize(name)

  buildController: (name) ->
    namespaces  = name.split('/')
    className   = _.pluralize(_.camelize(namespaces[namespaces.length - 1])) + 'Controller'
    if namespaces.length > 1
      namespaces = namespaces[0..-2]
      directory   = _.map(namespaces, (n) -> _.camelize(n, true)).join('/')
      namespace   = @app.namespace + '.' + _.map(namespaces, (n) -> _.camelize(n)).join('.')
    else
      namespace   = @app.namespace
      directory   = ''

    namespace:  namespace
    className:  className
    directory:  directory
    name:       _.camelize(className, true)
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
      if fs.existsSync(gitFile)
        lines     = fs.readFileSync(gitFile, 'utf-8').split('\n')
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
