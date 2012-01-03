class Tower.Generator.AppGenerator extends Tower.Generator
  run: ->
    @template "Cakefile"
    @template "Watchfile"
    
    @inside "config", ->
      @template "routes.coffee"
      @template "application.coffee"
      @template "environment.coffee"
      
      @directory "environments"
      @directory "initializers"
      @directory "locales"
      
    @inside "public", ->
      @template "humans.txt"
      @template "robots.txt"
  
module.exports = Tower.Generator.AppGenerator
