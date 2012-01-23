class Tower.Generator.Jasmine.IntegrationGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  run: ->
    @inside "test", '.', ->
      @inside "integration", '.', ->
        @template "integration.coffee", "#{@model.name}IntegrationTest.coffee"
        
module.exports = Tower.Generator.Jasmine.IntegrationGenerator
