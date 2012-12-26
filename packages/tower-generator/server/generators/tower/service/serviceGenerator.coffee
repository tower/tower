class Tower.GeneratorServiceGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    # @todo
    scriptType = 'coffee'

    @directory "#{Tower.root}/app/services"
    @directory "#{Tower.root}/app/services/server"
    @template "service.#{scriptType}", "#{Tower.root}/app/services/server/#{@model.name}.#{scriptType}"
    @asset "/app/services/server/#{@model.name}"
    @generate 'mocha:service'

module.exports = Tower.GeneratorServiceGenerator
