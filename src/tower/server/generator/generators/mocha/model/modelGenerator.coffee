class Tower.Generator.Mocha.ModelGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  run: ->
    @directory "test/models"
    @template "model.coffee", "test/models/#{@model.name}Test.coffee"
  
module.exports = Tower.Generator.Mocha.ModelGenerator
