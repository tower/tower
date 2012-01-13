class Tower.Generator.ModelGenerator extends Tower.Generator
  # tower generate model User email:string
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
      @inside "models", ->
        @template "model.coffee", "#{@model.fileName}.coffee", ->
  
module.exports = Tower.Generator.ModelGenerator
