class Tower.Generator.Jasmine.ModelGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  run: ->
    @inside "test", '.', ->
      @inside "models", '.', ->
        @template "model.coffee", "#{@model.name}Test.coffee"
        
module.exports = Tower.Generator.Jasmine.ModelGenerator
