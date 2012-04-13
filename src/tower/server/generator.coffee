class Tower.Generator extends Tower.Class
  sourceRoot: __dirname

  @run: (type, options) ->
    klass = @buildGenerator(type)
    new klass(options)

  @buildGenerator: (type) ->
    klass   = Tower.Generator
    # tower generate model
    # tower generate mocha:model
    nodes   = type.split(":")
    nodes[nodes.length - 1] += "Generator"

    for node, i in nodes
      klass = klass[Tower.Support.String.camelize(node)]

    klass

  constructor: (options = {}) ->
    options.program ||= {}
    _.extend @, options

    unless @appName
      name = process.cwd().split("/")
      @appName = name[name.length - 1]

    @destinationRoot  ||= process.cwd()

    @currentSourceDirectory = @currentDestinationDirectory = "."

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

require './generator/actions'
require './generator/configuration'
require './generator/helpers'
require './generator/resources'
require './generator/shell'

Tower.Generator.include Tower.Generator.Actions
Tower.Generator.include Tower.Generator.Configuration
Tower.Generator.include Tower.Generator.Helpers
Tower.Generator.include Tower.Generator.Resources
Tower.Generator.include Tower.Generator.Shell

Tower.Generator.Mocha = {}

require './generator/generators/tower/app/appGenerator'
require './generator/generators/tower/model/modelGenerator'
require './generator/generators/tower/view/viewGenerator'
require './generator/generators/tower/controller/controllerGenerator'
require './generator/generators/tower/helper/helperGenerator'
require './generator/generators/tower/assets/assetsGenerator'
require './generator/generators/tower/mailer/mailerGenerator'
require './generator/generators/tower/scaffold/scaffoldGenerator'
require './generator/generators/mocha/model/modelGenerator'

module.exports = Tower.Generator
