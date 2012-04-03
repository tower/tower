class Tower.Generator.Jasmine.ControllerGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @inside "test", '.', ->
      @inside "controllers", '.', ->
        @template "controller.coffee", "#{@model.pluralName}ControllerTest.coffee"

module.exports = Tower.Generator.Jasmine.ControllerGenerator
