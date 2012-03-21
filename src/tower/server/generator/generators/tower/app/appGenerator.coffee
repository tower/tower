class Tower.Generator.AppGenerator extends Tower.Generator
  sourceRoot: __dirname

  buildApp: (name = @appName) ->
    app = super(name)

    app.title       = @program.title || Tower.Support.String.camelize(app.name)
    app.description = @program.description
    app.keywords    = @program.keywords

    app

  run: ->
    @inside @app.name, '.', ->
      @template "gitignore", ".gitignore" unless @program.skipGitfile
      @template "npmignore", ".npmignore"
      @template "slugignore", ".slugignore" unless @program.skipProcfile

      @template "cake", "Cakefile"

      @inside "app", ->
        @inside "client", ->
          @inside "config", ->
            @template "application.coffee"
          @directory "helpers"
          @inside "stylesheets", ->
            @template "application.styl"
          @inside "controllers", ->
            @template "applicationController.coffee"

        @inside "controllers", ->
          @template "applicationController.coffee"

        @inside "helpers", ->
          @template "applicationHelper.coffee"

        @directory "mailers"

        @directory "models"

        @inside "views", ->
          @template "welcome.coffee"
          @inside "layouts", ->
            @template "application.coffee"
          @inside "shared", ->
            @template "_footer.coffee"
            @template "_header.coffee"
            @template "_meta.coffee"
            @template "_navigation.coffee"
            @template "_sidebar.coffee"

      @inside "config", ->
        @template "application.coffee"
        @template "assets.coffee"
        @template "credentials.coffee"
        @template "databases.coffee"
        @template "routes.coffee"
        @template "session.coffee"

        @inside "environments", ->
          @template "development.coffee"
          @template "production.coffee"
          @template "test.coffee"

        @directory "initializers"

        @inside "locales", ->
          @template "en.coffee"
    
      @inside "db", ->
        @template "seeds.coffee"

      @inside "lib", ->
        @directory "tasks"

      @directory "log"

      @template "pack", "package.json"
      @template "Procfile" unless @program.skipProcfile

      @inside "public", ->
        @template "404.html"
        @template "500.html"
        @template "fav.png", "favicon.png"
        @template "crossdomain.xml"
        @template "humans.txt"
        @template "robots.txt"
        @directory "images"
        @inside "javascripts", ->
          @inside "app", ->
            @inside "views", ->
              @createFile "templates.js", ""
        @directory "stylesheets"
        @directory "swfs"

      @template "README.md"

      @template "server.js"

      @inside "test", ->
        @directory "controllers"
        @directory "factories"
        @directory "features"
        @directory "models"
        @template "config.coffee"
        @template "mocha.opts"

      @directory "tmp"

      @inside "vendor", ->
        @inside "javascripts", ->
          @get "https://raw.github.com/documentcloud/underscore/master/underscore.js", "underscore.js"
          @get "https://raw.github.com/epeli/underscore.string/master/lib/underscore.string.js", "underscore.string.js"
          @get "https://raw.github.com/caolan/async/master/lib/async.js", "async.js"
          @get "https://raw.github.com/LearnBoost/socket.io-client/master/dist/socket.io.js", "socket.io.js"
          @get "https://raw.github.com/viatropos/design.io/master/design.io.js", "design.io.js"
          @get "https://raw.github.com/viatropos/tower/master/dist/tower.js", "tower.js"
          @get "https://raw.github.com/balupton/history.js/master/scripts/uncompressed/history.js", "history.js"
          @get "https://raw.github.com/balupton/history.js/master/scripts/uncompressed/history.adapter.jquery.js", "history.adapter.jquery.js"
          @get "https://raw.github.com/timrwood/moment/master/moment.js", "moment.js"
          @get "https://raw.github.com/medialize/URI.js/gh-pages/src/URI.js", "uri.js"
          @get "https://raw.github.com/visionmedia/mocha/master/mocha.js", "mocha.js"
          @get "http://sinonjs.org/releases/sinon-1.3.1.js", "sinon.js"
          @get "http://coffeekup.org/coffeekup.js", "coffeekup.js"
          @get "http://twitter.github.com/bootstrap/assets/js/google-code-prettify/prettify.js", "prettify.js"
          @get "https://raw.github.com/Marak/Faker.js/master/Faker.js", "faker.js"
          @get "https://raw.github.com/viatropos/factory.js/master/lib/factory.js", "factory.js"
          @get "http://html5shiv.googlecode.com/svn/trunk/html5.js", "html5.js"
          @directory "bootstrap"
          @get "https://raw.github.com/twitter/bootstrap/master/js/#{javascript}", "bootstrap/#{javascript}" for javascript in [
            "bootstrap-alert.js",
            "bootstrap-button.js",
            "bootstrap-carousel.js",
            "bootstrap-collapse.js",
            "bootstrap-dropdown.js",
            "bootstrap-modal.js",
            "bootstrap-popover.js",
            "bootstrap-scrollspy.js",
            "bootstrap-tab.js",
            "bootstrap-tooltip.js",
            "bootstrap-transition.js",
            "bootstrap-typeahead.js"
          ]
        @inside "stylesheets", ->
          @get "http://twitter.github.com/bootstrap/assets/js/google-code-prettify/prettify.css", "prettify.css"
          @directory "bootstrap"
          @get "https://raw.github.com/twitter/bootstrap/master/less/#{stylesheet}.less", "bootstrap/#{stylesheet}.less" for stylesheet in [
            "accordion",
            "alerts",
            "bootstrap",
            "breadcrumbs",
            "button-groups",
            "buttons",
            "carousel",
            "close",
            "code",
            "component-animations",
            "dropdowns",
            "forms",
            "grid",
            "hero-unit",
            "labels",
            "layouts",
            "mixins",
            "modals",
            "navbar",
            "navs",
            "pager",
            "pagination",
            "popovers",
            "progress-bars",
            "reset",
            "responsive",
            "scaffolding",
            "sprites",
            "tables",
            "thumbnails",
            "tooltip",
            "type",
            "utilities",
            "variables",
            "wells"
          ]
      @inside "public/images", ->
        @get "https://github.com/twitter/bootstrap/blob/master/img/glyphicons-halflings.png", "glyphicons-halflings.png"
        @get "https://github.com/twitter/bootstrap/blob/master/img/glyphicons-halflings-white.png", "glyphicons-halflings-white.png"

      @inside "public/swfs", ->
        @get "https://raw.github.com/LearnBoost/socket.io-client/master/dist/WebSocketMain.swf", "WebSocketMain.swf"
        @get "https://raw.github.com/LearnBoost/socket.io-client/master/dist/WebSocketMainInsecure.swf", "WebSocketMainInsecure.swf"

      @template "watch", "Watchfile"

module.exports = Tower.Generator.AppGenerator
