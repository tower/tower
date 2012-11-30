class Tower.GeneratorAssetsGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @inside "app", '.', ->
      @inside "stylesheets", '.', ->
        @inside "client", '.', ->
          #@template "stylesheet.css", "#{@model.pluralName}.styl"
        #@inside "controllers", '.', ->
        #  @template "controller.coffee", "#{@model.pluralName}Controller.coffee"

module.exports = Tower.GeneratorAssetsGenerator
