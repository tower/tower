class Tower.GeneratorMochaModelGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @directory "test/models"
    @template "model.coffee", "test/models/#{@model.name}Test.coffee"
    @asset "/test/models/#{@model.name}Test", bundle: "development"

module.exports = Tower.GeneratorMochaModelGenerator
