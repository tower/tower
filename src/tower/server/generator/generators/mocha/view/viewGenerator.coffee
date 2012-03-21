class Tower.Generator.Mocha.ViewGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @inside "test", ->
      @directory "views"

    @template "view.coffee", "test/views/#{@model.name}Test.coffee", ->

module.exports = Tower.Generator.Mocha.ViewGenerator
