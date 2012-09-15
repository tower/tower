class Tower.GeneratorViewGenerator extends Tower.Generator
  @reopen
    sourceRoot: __dirname

    run: ->
      # @todo
      scriptType = 'coffee'

      @directory "app/templates/shared/#{@view.directory}"

      views = [
        '_flash'
        '_form'
        '_item'
        '_list'
        '_table'
        'edit'
        'index'
        'new'
        'show'
      ]

      for view in views
        @template "#{view}.#{scriptType}", "app/templates/shared/#{@view.directory}/#{view}.#{scriptType}"

      views = [
        'form'
        'index'
        'show'
      ]

      for view in views
        @template "client/#{view}.#{scriptType}", "app/views/client/#{@view.directory}/#{view}.#{scriptType}"
        @asset "/app/views/client/#{@view.directory}/#{view}"

module.exports = Tower.GeneratorViewGenerator
