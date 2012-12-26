class Tower.GeneratorMochaServiceGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @directory "#{Tower.root}/test/cases/services"
    @directory "#{Tower.root}/test/cases/services/server"
    @template 'service.coffee', "#{Tower.root}/test/cases/services/server/#{@model.name}Test.coffee"
    @asset "/test/cases/services/server/#{@model.name}Test", bundle: 'development'

module.exports = Tower.GeneratorMochaServiceGenerator
