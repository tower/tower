class Tower.Generator.ScaffoldGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  run: ->
    @generate "model"
    @generate "view"
    @generate "controller"
    @generate "mailer"
    @generate "helper"
    @generate "assets"
  
module.exports = Tower.Generator.ScaffoldGenerator
