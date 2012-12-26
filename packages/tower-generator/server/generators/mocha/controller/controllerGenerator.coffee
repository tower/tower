class Tower.GeneratorMochaControllerGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @directory "#{Tower.root}/test/cases/controllers"
    @directory "#{Tower.root}/test/cases/controllers/client"
    @directory "#{Tower.root}/test/cases/controllers/server"
    @template 'controller.coffee', "#{Tower.root}/test/cases/controllers/server/#{@model.namePlural}ControllerTest.coffee", ->

module.exports = Tower.GeneratorMochaControllerGenerator
