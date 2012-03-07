class Tower.Generator.ControllerGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  run: ->
    @directory "app/controllers/#{@controller.directory}"
    @template "controller.coffee", "app/controllers/#{@controller.directory}/#{@controller.name}.coffee"
    @template "client/controller.coffee", "app/controllers/client/#{@controller.directory}/#{@controller.name}.coffee".replace(/\/+/g, "/")
    @route '@resources "' + @model.namePlural + '"'
    @asset "/app/controllers/client/#{@controller.directory}/#{@controller.name}".replace(/\/+/g, "/")
  
module.exports = Tower.Generator.ControllerGenerator
