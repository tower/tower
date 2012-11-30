class Tower.GeneratorMochaViewGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @directory 'test/cases/views'
    @directory 'test/cases/views/client'

    @template 'view.coffee', "test/cases/views/client/#{@model.name}Test.coffee", ->

module.exports = Tower.GeneratorMochaViewGenerator
