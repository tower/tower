class Tower.GeneratorMailerGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @template "mailer.coffee", "#{Tower.root}/app/mailers/#{@model.name}Mailer.coffee", ->

module.exports = Tower.GeneratorMailerGenerator
