class Tower.Generator.ModelGenerator extends Tower.Generator
  run: ->
    @inside "app", ->
      @directory "models"
      
    @template "model.coffee", "app/models/#{@model.fileName}.coffee", ->
  
module.exports = Tower.Generator.ModelGenerator
