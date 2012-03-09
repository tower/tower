class Tower.Generator.Mocha.ControllerGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  run: ->
    @directory "test/controllers"
    @template "controllers.coffee", "test/controllers/#{@model.name}Test.coffee", ->
  
module.exports = Tower.Generator.Mocha.ControllerGenerator
