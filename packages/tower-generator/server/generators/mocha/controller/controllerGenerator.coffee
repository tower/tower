class Tower.Generator.Mocha.ControllerGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @directory "test/controllers"
    @template "controller.coffee", "test/controllers/#{@model.namePlural}ControllerTest.coffee", ->

module.exports = Tower.Generator.Mocha.ControllerGenerator
