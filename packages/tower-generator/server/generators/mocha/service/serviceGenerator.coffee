class Tower.GeneratorMochaServiceGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @directory 'test/cases/services'
    @directory 'test/cases/services/server'
    @template 'service.coffee', "test/cases/services/server/#{@model.name}Test.coffee"
    @asset "/test/cases/services/server/#{@model.name}Test", bundle: 'development'

module.exports = Tower.GeneratorMochaServiceGenerator
