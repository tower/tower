class Tower.GeneratorMailerGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @inside "app", '.', ->
      @inside "mailers", '.', ->
        @template "mailer.coffee", "#{@model.name}Mailer.coffee", ->

module.exports = Tower.GeneratorMailerGenerator
