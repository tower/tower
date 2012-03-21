class Tower.Generator.AssetsGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @inside "app", '.', ->
      @inside "client", '.', ->
        @inside "stylesheets", '.', ->
          #@template "stylesheet.css", "#{@model.pluralName}.styl"
        #@inside "controllers", '.', ->
        #  @template "controller.coffee", "#{@model.pluralName}Controller.coffee"

module.exports = Tower.Generator.AssetsGenerator
