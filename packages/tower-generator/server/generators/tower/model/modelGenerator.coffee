class Tower.GeneratorModelGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @directory "app/models"
    @template "model.coffee", "app/models/#{@model.name}.coffee"
    @template "factory.coffee", "test/factories/#{@model.name}Factory.coffee"
    @asset "/app/models/#{@model.name}"
    @bootstrap @model
    @generate "mocha:model"

module.exports = Tower.GeneratorModelGenerator
