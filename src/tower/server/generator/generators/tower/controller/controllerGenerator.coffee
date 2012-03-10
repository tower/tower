class Tower.Generator.ControllerGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  run: ->
    @directory "app/controllers/#{@controller.directory}"
    @template "controller.coffee", "app/controllers/#{@controller.directory}/#{@controller.name}.coffee"
    @template "client/controller.coffee", "app/client/controllers/#{@controller.directory}/#{@controller.name}.coffee".replace(/\/+/g, "/")
    @route '@resources "' + @model.namePlural + '"'
    @navigation @model.namePlural, "urlFor(#{@app.namespace}.#{@model.className})"
    @locale /links: */, """\n    #{@model.namePlural}: "#{@model.humanName}"
"""
    @asset "/app/client/controllers/#{@controller.directory}/#{@controller.name}".replace(/\/+/g, "/")
  
module.exports = Tower.Generator.ControllerGenerator
