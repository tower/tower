class Tower.GeneratorMochaViewGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @inside "test", ->
      @directory "views"

    @template "view.coffee", "test/views/#{@model.name}Test.coffee", ->

module.exports = Tower.GeneratorMochaViewGenerator
