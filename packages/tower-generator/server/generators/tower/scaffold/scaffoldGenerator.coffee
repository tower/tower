class Tower.GeneratorScaffoldGenerator extends Tower.Generator
  @reopen
    sourceRoot: __dirname

    run: ->
      @generate "model"
      @generate "view"
      @generate "controller"
      #@generate "helper"
      @generate "assets"

module.exports = Tower.GeneratorScaffoldGenerator
