class Tower.GeneratorHelperGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @inside "app", '.', ->
      @inside "helpers", '.', ->
        @template "helper.coffee", "#{@model.name}Helper.coffee", ->

module.exports = Tower.GeneratorHelperGenerator
