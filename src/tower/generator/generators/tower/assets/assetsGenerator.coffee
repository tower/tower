class Tower.Generator.ScaffoldGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  run: ->
    @inside "app", ->
      @inside "client", ->
        @inside "stylesheets", ->
          @template "stylesheet.css", "#{@model.resourceName}.styl"
        @inside "controllers", ->
          @template "javascript.js", "#{@model.resourceName}.coffee"
  
module.exports = Tower.Generator.ScaffoldGenerator
