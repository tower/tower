class Tower.Generator.Mocha.ControllerGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  run: ->
    @inside "test", ->
      @directory "controllers"
      
    @template "controllers.coffee", "test/controllers/#{@model.name}Test.coffee", ->
  
module.exports = Tower.Generator.Mocha.ControllerGenerator
