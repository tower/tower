_ = Tower._

class Tower.Generator# extends Tower.Class
  @include: (mixin) ->
    _.extend(@::, mixin)

  @run: (type, options) ->
    klass = @buildGenerator(type)
    new klass(options)

  @buildGenerator: (type) ->
    # tower generate model
    # tower generate mocha:model
    nodes   = type.split(':')
    nodes[nodes.length - 1] += 'Generator'

    for node, i in nodes
      nodes[i] = _.camelize(node)

    klass = Tower['Generator' + nodes.join('')]

    klass

  sourceRoot: __dirname

  constructor: (options = {}) ->
    options.program ||= {}
    _.extend @, options
    @silent = !!options.program.quiet unless @hasOwnProperty('silent')

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
