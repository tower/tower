class Tower.GeneratorMochaControllerGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @directory 'test/cases/controllers'
    @directory 'test/cases/controllers/client'
    @directory 'test/cases/controllers/server'
    @template 'controller.coffee', "test/cases/controllers/server/#{@model.namePlural}ControllerTest.coffee", ->

module.exports = Tower.GeneratorMochaControllerGenerator
