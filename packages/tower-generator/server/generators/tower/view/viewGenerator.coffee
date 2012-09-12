class Tower.GeneratorViewGenerator extends Tower.Generator
  @reopen
    sourceRoot: __dirname

    run: ->
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
        @template "#{view}.coffee", "app/templates/shared/#{@view.directory}/#{view}.coffee"

      views = [
        'form'
        'index'
        'show'
      ]

      for view in views
        @template "client/#{view}.coffee", "app/views/client/#{@view.directory}/#{view}.coffee"
        @asset "/app/views/client/#{@view.directory}/#{view}"

module.exports = Tower.GeneratorViewGenerator
