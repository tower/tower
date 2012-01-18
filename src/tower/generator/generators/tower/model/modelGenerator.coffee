class Tower.Generator.ModelGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  run: ->
    @inside "app", ->
      @directory "models"
      
    @template "model.coffee", "app/models/#{@model.fileName}.coffee", ->
  
module.exports = Tower.Generator.ModelGenerator
