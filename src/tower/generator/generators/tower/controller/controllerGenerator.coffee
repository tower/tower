class Tower.Generator.ControllerGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  run: ->
    @inside "app", '.', ->
      @inside "controllers", '.', ->
        @template "controller.coffee", "#{@model.pluralName}Controller.coffee"
      @inside "client", ->
        @inside "controllers", '.', ->
          @template "controller.coffee", "#{@model.pluralName}Controller.coffee"
        
    @route '@resources "' + @model.pluralName + '"'
  
module.exports = Tower.Generator.ControllerGenerator
