class Tower.Generator.MailerGenerator extends Tower.Generator
  run: ->
    @inside "app", ->
      @inside "controllers", ->
        @template "controller.coffee", "#{@model.resourceName}.coffee", ->
  
module.exports = Tower.Generator.ModelGenerator
