class Tower.Generator.AppGenerator extends Tower.Generator
  run: ->
    @template ".gitignore"
    @template ".npmignore"
    @template ".slugignore"
    
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
        
      @inside "initializers", ->
        @template "secrets.coffee"
        @template "session.coffee"
      
      @inside "locales", ->
        @template "en.coffee"
        
    @inside "lib", ->
      @directory "tasks"
      
    @directory "log"
    
    @template "package.json"
    @template "Procfile"
    
    @inside "public", ->
      @template "humans.txt"
      @template "robots.txt"
      
    @template "README.md"
    
    @template "server.js"
    
    @inside "test", ->
      @directory "controllers"
      @directory "factories"
      @directory "features"
      @directory "models"
      @template "config.coffee"
    
    @directory "tmp"
    
    @inside "vendor", ->
      @directory "javascripts"
      @directory "stylesheets"
      @directory "swfs"
    
    @template "Watchfile"
  
module.exports = Tower.Generator.AppGenerator
