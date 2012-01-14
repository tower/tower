class Tower.Generator.ScaffoldGenerator extends Tower.Generator
  constructor: (argv, options = {}) ->
    super(options)
    @model = model = className: argv.shift(), attributes: []
    
    for pair in argv
      pair  = pair.split(":")
      name  = pair[0]
      type  = Tower.Support.String.camelize(pair[1] || pair[0], true)
      model.attributes.push new Tower.Generator.Attribute(name, Tower.Support.String.camelize(type))
      
    model.fileName = Tower.Support.String.camelize(model.className, true)
  
  run: ->
    @inside "app", ->
      @inside "client", ->
        @inside "stylesheets", ->
          @template "#{@model.resourceName}.stylus"
  
module.exports = Tower.Generator.ScaffoldGenerator
