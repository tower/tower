class Tower.GeneratorControllerGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    # @todo
    scriptType = 'coffee'

    @directory "app/controllers/server/#{@controller.directory}"
    @template "controller.#{scriptType}", "app/controllers/server/#{@controller.directory}/#{@controller.name}.#{scriptType}"
    @template "client/controller.#{scriptType}", "app/controllers/client/#{@controller.directory}/#{@controller.name}.#{scriptType}".replace(/\/+/g, "/")
    #@template "client/objectController.coffee", "app/client/controllers/#{@model.name}Controller.coffee".replace(/\/+/g, "/")
    @route "@resources '" + @model.paramNamePlural + "'"
    @navigation @model.namePlural, "urlFor(#{@app.namespace}.#{@model.className})"
    @locale /links: */, """\n    #{@model.namePlural}: "#{@model.humanNamePlural}"
"""
    @asset "/app/controllers/client/#{@controller.directory}/#{@controller.name}".replace(/\/+/g, "/")
    @generate 'mocha:controller'

module.exports = Tower.GeneratorControllerGenerator
