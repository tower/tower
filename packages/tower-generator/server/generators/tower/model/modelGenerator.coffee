class Tower.GeneratorModelGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    # @todo
    scriptType = 'coffee'

    @directory "#{Tower.root}/app/models"
    @directory "#{Tower.root}/app/models/shared"
    @template "model.#{scriptType}", "#{Tower.root}/app/models/shared/#{@model.name}.#{scriptType}"
    @template "factory.#{scriptType}", "#{Tower.root}/test/factories/#{@model.name}Factory.#{scriptType}"
    @asset "app/models/shared/#{@model.name}"
    @bootstrap @model
    @seed @model
    @generate 'mocha:model'

module.exports = Tower.GeneratorModelGenerator
