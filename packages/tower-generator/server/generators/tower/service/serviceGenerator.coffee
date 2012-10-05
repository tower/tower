class Tower.GeneratorServiceGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    # @todo
    scriptType = 'coffee'

    @directory 'app/services'
    @directory 'app/services/server'
    @template "service.#{scriptType}", "app/services/server/#{@model.name}.#{scriptType}"
    @asset "/app/services/server/#{@model.name}"
    @generate 'mocha:service'

module.exports = Tower.GeneratorServiceGenerator
