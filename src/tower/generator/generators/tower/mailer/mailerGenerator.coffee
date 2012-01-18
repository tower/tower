class Tower.Generator.MailerGenerator extends Tower.Generator
  run: ->
    @inside "app", ->
      @inside "mailers", ->
        @template "mailer.coffee", "#{@model.resourceName}Mailer.coffee", ->
  
module.exports = Tower.Generator.MailerGenerator
