class Tower.Generator.Mocha.ModelGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  run: ->
    @inside "test", ->
      @directory "models"
    
    @template "model.coffee", "test/models/#{@model.name}Test.coffee"
  
module.exports = Tower.Generator.Mocha.ModelGenerator
