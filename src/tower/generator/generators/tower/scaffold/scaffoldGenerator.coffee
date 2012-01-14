class Tower.Generator.ScaffoldGenerator extends Tower.Generator
  run: ->
    @hookFor "model"
    @hookFor "view"
    @hookFor "controller"
    @hookFor "mailer"
    @hookFor "helper"
    @hookFor "assets"
  
module.exports = Tower.Generator.ScaffoldGenerator
