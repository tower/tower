class Tower.GeneratorLibraryGenerator extends Tower.Generator
  sourceRoot: __dirname

  buildApp: (name) ->
    @program.namespace ||= @program.args[2]
    name ||= @program.namespace
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

      @directory "src"

      @template "index.coffee", "src/index.coffee"

      @inside "test", ->
        @template "server.coffee"
        @template "client.coffee"
        @template "mocha.opts"

      @directory "tmp"

      @template "watch", "Watchfile"

module.exports = Tower.GeneratorLibraryGenerator
