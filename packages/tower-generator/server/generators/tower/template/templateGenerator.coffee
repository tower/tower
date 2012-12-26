class Tower.GeneratorTemplateGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    # @todo
    scriptType = 'coffee'

    @directory "#{Tower.root}/app/templates/shared/#{@view.directory}"

    templates = [
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

    for template in templates
      @template "#{template}.#{scriptType}", "#{Tower.root}/app/templates/shared/#{@view.directory}/#{template}.#{scriptType}"

module.exports = Tower.GeneratorViewGenerator
