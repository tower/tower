class Tower.GeneratorControllerGenerator extends Tower.Generator
  @reopen
    sourceRoot: __dirname

    run: ->
      @directory "app/controllers/server/#{@controller.directory}"
      @template "controller.coffee", "app/controllers/server/#{@controller.directory}/#{@controller.name}.coffee"
      @template "client/controller.coffee", "app/controllers/client/#{@controller.directory}/#{@controller.name}.coffee".replace(/\/+/g, "/")
      #@template "client/objectController.coffee", "app/client/controllers/#{@model.name}Controller.coffee".replace(/\/+/g, "/")
      @route "@resources '" + @model.paramNamePlural + "'"
      @navigation @model.namePlural, "urlFor(#{@app.namespace}.#{@model.className})"
      @locale /links: */, """\n    #{@model.namePlural}: "#{@model.humanNamePlural}"
  """
      @asset "/app/controllers/client/#{@controller.directory}/#{@controller.name}".replace(/\/+/g, "/")
      #@asset "/app/client/controllers/#{@controller.directory}/#{@model.name}Controller".replace(/\/+/g, "/")
      @generate "mocha:controller"

module.exports = Tower.GeneratorControllerGenerator
