class Tower.GeneratorHelperGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @template "helper.coffee", "#{Tower.root}/app/helpers/#{@model.name}Helper.coffee", ->

module.exports = Tower.GeneratorHelperGenerator
