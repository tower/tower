class Tower.GeneratorAppGenerator extends Tower.Generator
  sourceRoot: __dirname

  buildApp: (name = @appName) ->
    app = super(name)

    app.title       = @program.title || _.titleize(_.humanize(app.name))
    app.description = @program.description
    app.keywords    = @program.keywords

    app

  run: ->
    twitterBootstrapCommit = "aaabe2a46c64e7d9ffd5735dba2db4f3cf9906f5"

    @inside @app.name, '.', ->
      @template "gitignore", ".gitignore" unless @program.skipGitfile
      @template "npmignore", ".npmignore"
      @template "slugignore", ".slugignore" unless @program.skipProcfile

      @template "cake", "Cakefile"

      @inside "app", ->
        @inside "client", ->
          @inside "config", ->
            @template "bootstrap.coffee"
          @inside "stylesheets", ->
            @template "application.styl"
          @inside "controllers", ->
            @template "applicationController.coffee"
          @inside "views", ->
            @inside "layouts", ->
              @template "application.coffee"

        @inside "controllers", ->
          @template "applicationController.coffee"

        @directory "models"

        @inside "views", ->
          @template "welcome.coffee"
          @inside "layouts", ->
            @template "application.coffee"
          @inside "shared", ->
            @template "_body.coffee"
            @template "_flash.coffee"
            @template "_footer.coffee"
            @template "_header.coffee"
            @template "_meta.coffee"
            @template "_navigation.coffee"
            @template "_sidebar.coffee"

      @inside "config", ->
        @template "application.coffee"
        @template "assets.coffee"
        @template "bootstrap.coffee"
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
        @template "server.coffee"
        @template "client.coffee"
        @template "mocha.opts"

      @directory "tmp"
      
      @inside "vendor", ->
        @inside "javascripts", ->
          # https://github.com/eriwen/javascript-stacktrace
          @get "https://raw.github.com/documentcloud/underscore/master/underscore.js", "underscore.js"
          @get "https://raw.github.com/epeli/underscore.string/master/lib/underscore.string.js", "underscore.string.js"
          @get "https://raw.github.com/caolan/async/master/lib/async.js", "async.js"
          # https://github.com/viatropos/tiny-require.js
          @get "https://raw.github.com/LearnBoost/socket.io-client/master/dist/socket.io.js", "socket.io.js"
          @get "https://raw.github.com/viatropos/design.io/master/design.io.js", "design.io.js"
          # @todo make this more customizable
          @get "http://cloud.github.com/downloads/viatropos/tower/tower.js", "tower.js"
          # Trying out ember's history implementation, which is much lighter
          # @get "https://raw.github.com/balupton/history.js/master/scripts/uncompressed/history.js", "history.js"
          # @get "https://raw.github.com/balupton/history.js/master/scripts/uncompressed/history.adapter.jquery.js", "history.adapter.jquery.js"
          # https://github.com/paulmillr/es6-shim
          @get "https://raw.github.com/timrwood/moment/master/moment.js", "moment.js"
          @get "https://raw.github.com/medialize/URI.js/gh-pages/src/URI.js", "uri.js"
          @get "https://raw.github.com/visionmedia/mocha/master/mocha.js", "mocha.js"
          @get "https://raw.github.com/manuelbieh/Geolib/390e9d4e26c05bfdba86fe1a28a8548c58a9b841/geolib.js", "geolib.js"
          @get "https://raw.github.com/chriso/node-validator/master/validator.js", "validator.js"
          @get "https://raw.github.com/viatropos/node.inflection/master/lib/inflection.js", "inflection.js"
          @get "https://raw.github.com/josscrowcroft/accounting.js/9ff4a4022e5c08f028d652d2b0ba1d4b65588bde/accounting.js", "accounting.js"
          @get "https://raw.github.com/edubkendo/sinon.js/2c6518de91c793344c7ead01a34556585f1b4d2c/sinon.js", "sinon.js"
          @get "https://raw.github.com/chaijs/chai/efc77596338556cca5fb4eade95c3838a743a186/chai.js", "chai.js"
          @get "https://raw.github.com/gradus/coffeecup/2d76a48c1292629dbe961088f756f00b034f0060/lib/coffeecup.js", "coffeekup.js"
          @get "https://raw.github.com/emberjs/starter-kit/1e6ee1418c694206a49bd7b021fe5996e7fdb14c/js/libs/ember-1.0.pre.js", "ember.js"
          @get "https://raw.github.com/emberjs/starter-kit/1e6ee1418c694206a49bd7b021fe5996e7fdb14c/js/libs/handlebars-1.0.0.beta.6.js", "handlebars.js"
          @get "https://raw.github.com/edubkendo/prettify.js/544c6cdf16594c85d3698dd0cbe07a9f232d02d9/prettify.js", "prettify.js"
          @get "https://raw.github.com/Marak/Faker.js/master/Faker.js", "faker.js"
          @get "https://raw.github.com/madrobby/keymaster/c61b3fef9767d4899a1732b089ca70512c9d4261/keymaster.js", "keymaster.js"
          @get "https://raw.github.com/mrdoob/stats.js/master/src/Stats.js", "stats.js"
          @get "http://html5shiv.googlecode.com/svn/trunk/html5.js", "html5.js"
          @directory "bootstrap"
          @get "https://raw.github.com/twitter/bootstrap/#{twitterBootstrapCommit}/js/#{javascript}.js", "bootstrap/#{javascript}.js" for javascript in [
            "bootstrap-alert"
            "bootstrap-button"
            "bootstrap-carousel"
            "bootstrap-collapse"
            "bootstrap-dropdown"
            "bootstrap-modal"
            "bootstrap-popover"
            "bootstrap-scrollspy"
            "bootstrap-tab"
            "bootstrap-tooltip"
            "bootstrap-transition"
            "bootstrap-typeahead"
          ]
        @inside "stylesheets", ->
          @get "http://twitter.github.com/bootstrap/assets/js/google-code-prettify/prettify.css", "prettify.css"
          @get "https://raw.github.com/visionmedia/mocha/master/mocha.css", "mocha.css"
          @directory "bootstrap"
          ###
          adm   = require("adm-zip")
          agent = require("superagent")
          fs    = require("fs")
          tmp   = "tmp/twitter-bootstrap.zip"
          url   = "https://github.com/twitter/bootstrap/zipball/v2.0.3"

          agent.get url, (response) ->
            fs.writeFileSync(tmp, response.text)
            zip         = new adm(tmp)
            zipEntries  = zip.getEntries()

            zipEntries.forEach (zipEntry) ->
              consolelog zipEntry.toString()
          ###
          @get "https://raw.github.com/twitter/bootstrap/#{twitterBootstrapCommit}/less/#{stylesheet}.less", "bootstrap/#{stylesheet}.less" for stylesheet in [
            "accordion"
            "alerts"
            "bootstrap"
            "breadcrumbs"
            "button-groups"
            "buttons"
            "carousel"
            "close"
            "code"
            "component-animations"
            "dropdowns"
            "forms"
            "grid"
            "hero-unit"
            "labels-badges"
            "layouts"
            "mixins"
            "modals"
            "navbar"
            "navs"
            "pager"
            "pagination"
            "popovers"
            "progress-bars"
            "reset"
            "responsive-1200px-min"
            "responsive-767px-max"
            "responsive-768px-979px"
            "responsive-navbar"
            "responsive-utilities"
            "responsive"
            "scaffolding"
            "sprites"
            "tables"
            "thumbnails"
            "tooltip"
            "type"
            "utilities"
            "variables"
            "wells"
          ]
      @inside "public/images", ->
        @get "https://raw.github.com/twitter/bootstrap/#{twitterBootstrapCommit}/img/glyphicons-halflings.png", "glyphicons-halflings.png"
        @get "https://raw.github.com/twitter/bootstrap/#{twitterBootstrapCommit}/img/glyphicons-halflings-white.png", "glyphicons-halflings-white.png"

      @inside "public/swfs", ->
        @get "https://raw.github.com/LearnBoost/socket.io-client/master/dist/WebSocketMain.swf", "WebSocketMain.swf"
        @get "https://raw.github.com/LearnBoost/socket.io-client/master/dist/WebSocketMainInsecure.swf", "WebSocketMainInsecure.swf"

      @template "grunt.coffee", "grunt.coffee"

      # github wiki
      @inside "wiki", ->
        @template "home.md"
        @template "_sidebar.md"

module.exports = Tower.GeneratorAppGenerator
