class Tower.Generator extends Tower.Class
  sourceRoot: __dirname

  @run: (type, options) ->
    klass = @buildGenerator(type)
    new klass(options)

  @buildGenerator: (type) ->
    klass   = Tower.Generator
    # tower generate model
    # tower generate mocha:model
    nodes   = type.split(':')
    nodes[nodes.length - 1] += 'Generator'

    for node, i in nodes
      klass = klass[Tower.SupportString.camelize(node)]

    klass

  init: (options = {}) ->
    @_super arguments...

    options.program ||= {}
    _.extend @, options

    unless @appName
      name = process.cwd().split('/')
      @appName = name[name.length - 1]

    @destinationRoot  ||= process.cwd()

    @currentSourceDirectory = @currentDestinationDirectory = '.'

    unless @app
      @app          = @buildApp()
      @user             = {}
      @buildUser (user) =>
        @user   = user
        @model  = @buildModel(@modelName, @app.className, @program.args) if @modelName
        if @model
          @view       = @buildView(@modelName)
          @controller = @buildController(@modelName)
        @run()

  run: ->

module.exports = Tower.Generator
