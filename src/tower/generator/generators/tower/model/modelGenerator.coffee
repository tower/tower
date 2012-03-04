class Tower.Generator.ModelGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  run: ->
    @directory "app/models"
    @template "model.coffee", "app/models/#{@model.name}.coffee"
    @asset "/app/models/#{@model.name}"
  
module.exports = Tower.Generator.ModelGenerator
