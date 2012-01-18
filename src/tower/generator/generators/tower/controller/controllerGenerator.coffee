class Tower.Generator.ControllerGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  run: ->
    @inside "app", ->
      @inside "controllers", ->
        @template "controller.coffee", "#{@model.resourceName}.coffee", ->
  
module.exports = Tower.Generator.ControllerGenerator
