class Tower.GeneratorMochaModelGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @directory "#{Tower.root}/test/cases/models"
    @directory "#{Tower.root}/test/cases/models/client"
    @directory "#{Tower.root}/test/cases/models/server"
    @directory "#{Tower.root}/test/cases/models/shared"
    @template 'model.coffee', "#{Tower.root}/test/cases/models/shared/#{@model.name}Test.coffee"
    @asset "/test/cases/models/shared/#{@model.name}Test", bundle: 'development'

module.exports = Tower.GeneratorMochaModelGenerator
