class Tower.GeneratorMochaModelGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @directory 'test/cases/models'
    @directory 'test/cases/models/client'
    @directory 'test/cases/models/server'
    @directory 'test/cases/models/shared'
    @template 'model.coffee', "test/cases/models/shared/#{@model.name}Test.coffee"
    @asset "/test/cases/models/shared/#{@model.name}Test", bundle: 'development'

module.exports = Tower.GeneratorMochaModelGenerator
