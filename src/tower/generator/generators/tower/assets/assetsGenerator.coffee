class Tower.Generator.ScaffoldGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  run: ->
    @inside "app", ->
      @inside "client", ->
        @inside "stylesheets", ->
          @template "stylesheet.css", "#{@model.name}.styl"
        @inside "controllers", ->
          @template "javascript.js", "#{@model.pluralName}Controller.coffee"
  
module.exports = Tower.Generator.ScaffoldGenerator
