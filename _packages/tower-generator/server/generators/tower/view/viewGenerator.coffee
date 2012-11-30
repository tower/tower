class Tower.GeneratorViewGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    # @todo
    scriptType = 'coffee'

    views = [
      'form'
      'index'
      'show'
    ]

    for view in views
      @template "#{view}.#{scriptType}", "app/views/client/#{@view.directory}/#{view}.#{scriptType}"
      @asset "/app/views/client/#{@view.directory}/#{view}"

module.exports = Tower.GeneratorViewGenerator
