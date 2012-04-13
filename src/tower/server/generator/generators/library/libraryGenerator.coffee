class Tower.Generator.LibraryGenerator extends Tower.Generator
  sourceRoot: __dirname

  buildApp: (name = @appName) ->
    app = super(name)

    app.title       = @program.title || _.titleize(app.name)
    app.description = @program.description
    app.keywords    = @program.keywords

    app
  
  run: ->
    @inside @app.name, '.', ->
      @template "gitignore", ".gitignore" unless @program.skipGitfile
      @template "npmignore", ".npmignore"

      @template "cake", "Cakefile"
      @template "pack", "package.json"
      @template "README.md"
      
      @directory "lib"
      
      @inside "src", ->
        @template "index.coffee", "#{@app.name}.coffee"

      @inside "test", ->
        @template "server.coffee"
        @template "client.coffee"
        @template "mocha.opts"

      @directory "tmp"
      
      @template "watch", "Watchfile"
      
module.exports = Tower.Generator.LibraryGenerator
