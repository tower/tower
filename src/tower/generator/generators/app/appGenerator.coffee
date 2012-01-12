class Tower.Generator.AppGenerator extends Tower.Generator
  run: ->
    @template "Cakefile"
    
    @inside "app", ->
      @inside "client", ->
        @inside "controllers", ->
          @template "applicationController.coffee"
        @inside "stylesheets", ->
          @template "application.stylus"
      @inside "controllers", ->
        @template "applicationController.coffee"
      @inside "helpers", ->
        @template "applicationHelper.coffee"
      @directory "models"
      @inside "views", ->
        @inside "layouts", ->
          @template "application.coffee"
    
    @inside "config", ->
      @template "routes.coffee"
      @template "application.coffee"
      
      @inside "environments", ->
        @template "development.coffee"
        @template "production.coffee"
        @template "test.coffee"
        
      @directory "initializers"
      
      @inside "locales", ->
        @template "en.coffee"
        
    @inside "lib", ->
      @directory "tasks"
    
    @template "package.json"
      
    @inside "public", ->
      @template "humans.txt"
      @template "robots.txt"
      
    @template "README.md"
    
    @template "server.js"
    
    @inside "vendor", ->
      @directory "javascripts"
      @directory "stylesheets"
      @directory "swfs"
    
    @template "Watchfile"
  
module.exports = Tower.Generator.AppGenerator
