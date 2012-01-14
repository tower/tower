class Tower.Generator.ControllerGenerator extends Tower.Generator
  run: ->
    @inside "app", ->
      @inside "controllers", ->
        @template "controller.coffee", "#{@model.resourceName}.coffee", ->
  
module.exports = Tower.Generator.ModelGenerator
