class Tower.GeneratorModelGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    # @todo
    scriptType = 'coffee'

    @directory 'app/models'
    @directory 'app/models/shared'
    @template "model.#{scriptType}", "app/models/shared/#{@model.name}.#{scriptType}"
    @template "factory.#{scriptType}", "test/factories/#{@model.name}Factory.#{scriptType}"
    @asset "/app/models/shared/#{@model.name}"
    @bootstrap @model
    @seed @model
    @generate 'mocha:model'

module.exports = Tower.GeneratorModelGenerator
