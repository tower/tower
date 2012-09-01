twitterBootstrapCommit = 'aaabe2a46c64e7d9ffd5735dba2db4f3cf9906f5'

class Tower.GeneratorAppGenerator extends Tower.Generator
  sourceRoot: __dirname

  buildApp: (name = @appName) ->
    app = super(name)

    app.title       = @program.title || _.titleize(_.humanize(app.name))
    app.description = @program.description
    app.keywords    = @program.keywords
    app.stylesheetEngine = @program.stylesheetEngine
    app.scriptType  = @program.scriptType
    app.templateEngine = @program.templateEngine

    app

  run: ->
    {JAVASCRIPTS, STYLESHEETS, IMAGES, SWFS} = Tower.GeneratorAppGenerator

    scriptType        = @program.scriptType
    isCoffee          = scriptType == 'coffee'
    templateEngine    = @program.templateEngine
    stylesheetEngine  = @program.stylesheetEngine || 'styl'

    @inside @app.name, '.', ->
      @template 'gitignore', '.gitignore' unless @program.skipGitfile
      @template 'npmignore', '.npmignore'
      @template 'slugignore', '.slugignore' unless @program.skipProcfile

      @template 'cake', 'Cakefile' if isCoffee 

      @inside 'app', ->
        @inside 'config', ->
          @inside 'client', ->
            @template "bootstrap.#{scriptType}"
            @template "watch.#{scriptType}"

          @inside 'server', ->
            @template "application.#{scriptType}"
            @template "assets.#{scriptType}"
            @template "bootstrap.#{scriptType}"
            @template "credentials.#{scriptType}"
            @template "databases.#{scriptType}"
            @template "routes.#{scriptType}"
            @template "session.#{scriptType}"

            @inside 'environments', ->
              if isCoffee # @todo tmp
                @template "development.#{scriptType}"
                @template "production.#{scriptType}"
                @template "test.#{scriptType}"

            @directory 'initializers'

          @inside 'shared', ->
            @inside 'locales', ->
              @template "en.#{scriptType}"

        @inside 'controllers', ->
          @inside 'client', ->
            @template "applicationController.#{scriptType}"
          @inside 'server', ->
            @template "applicationController.#{scriptType}"

        @inside 'models', ->
          @directory 'client'
          @directory 'server'
          @directory 'shared'

        @inside 'stylesheets', ->
          @inside 'client', ->
            @template "application.#{stylesheetEngine}"
          @inside 'server', ->
            @template "email.#{stylesheetEngine}"

        @inside 'templates', ->
          @inside 'server', ->
            @inside 'layout', ->
              @template "application.#{templateEngine}"
              @template "_meta.#{templateEngine}"
          @inside 'shared', ->
            @template "welcome.#{templateEngine}"
            @inside 'layout', ->
              @template "_body.#{templateEngine}"
              @template "_flash.#{templateEngine}"
              @template "_footer.#{templateEngine}"
              @template "_header.#{templateEngine}"
              @template "_navigation.#{templateEngine}"
              @template "_sidebar.#{templateEngine}"

        @inside 'views', ->
          @inside 'client', ->
            @inside 'layout', ->
              @template "application.#{scriptType}"

      @inside 'data', ->
        @template "seeds.#{scriptType}"

      @directory 'lib'
      @directory 'log'

      @template 'pack', 'package.json'
      @template 'Procfile' unless @program.skipProcfile

      @inside 'public', ->
        @template '404.html'
        @template '500.html'
        @template 'fav.png', 'favicon.png'
        @template 'crossdomain.xml'
        @template 'humans.txt'
        @template 'robots.txt'
        @directory 'fonts'
        @directory 'images'
        @inside 'javascripts', ->
          @inside 'app', ->
            @inside 'templates', ->
              @inside 'client', ->
                @createFile 'index.js', ''
        @directory 'stylesheets'
        @directory 'swfs'
        @directory 'uploads'

      @template 'README.md'

      @template 'server.js'

      @inside 'test', ->
        @directory 'controllers'
        @directory 'factories'
        @directory 'features'
        @directory 'models'
        @template "client.#{scriptType}"
        @template 'mocha.opts'
        @template "server.#{scriptType}"

      @directory 'tmp'
      
      @inside 'vendor', ->
        @inside 'javascripts', ->
          @directory 'bootstrap'
          @get(remote, local) for remote, local of JAVASCRIPTS
        @inside 'stylesheets', ->
          @directory 'bootstrap'
          @get(remote, local) for remote, local of STYLESHEETS
      @inside 'public/images', ->
        @get(remote, local) for remote, local of IMAGES
      @inside 'public/swfs', ->
        @get(remote, local) for remote, local of SWFS

      @template "grunt.#{scriptType}", "grunt.#{scriptType}"

      # github wiki
      @inside 'wiki', ->
        @template 'home.md'
        @template '_sidebar.md'

JAVASCRIPTS =
  # https://github.com/eriwen/javascript-stacktrace
  'https://raw.github.com/documentcloud/underscore/master/underscore.js': 'underscore.js'
  'https://raw.github.com/epeli/underscore.string/master/lib/underscore.string.js': 'underscore.string.js'
  'https://raw.github.com/caolan/async/master/lib/async.js': 'async.js'
  # https://github.com/viatropos/tiny-require.js
  'https://raw.github.com/LearnBoost/socket.io-client/master/dist/socket.io.js': 'socket.io.js'
  'http://cloud.github.com/downloads/viatropos/tower/tower.js': 'tower.js'
  # https://github.com/paulmillr/es6-shim
  'https://raw.github.com/timrwood/moment/master/moment.js': 'moment.js'
  'https://raw.github.com/andris9/jStorage/72c44323d33bb6a4c3610bdb774184e3a43a230f/jstorage.min.js': 'jstorage.js'
  'https://raw.github.com/medialize/URI.js/gh-pages/src/URI.js': 'uri.js'
  'https://raw.github.com/visionmedia/mocha/master/mocha.js': 'mocha.js'
  'https://raw.github.com/manuelbieh/Geolib/390e9d4e26c05bfdba86fe1a28a8548c58a9b841/geolib.js': 'geolib.js'
  'https://raw.github.com/chriso/node-validator/master/validator.js': 'validator.js'
  'https://raw.github.com/viatropos/node.inflection/master/lib/inflection.js': 'inflection.js'
  'https://raw.github.com/josscrowcroft/accounting.js/9ff4a4022e5c08f028d652d2b0ba1d4b65588bde/accounting.js': 'accounting.js'
  'https://raw.github.com/edubkendo/sinon.js/2c6518de91c793344c7ead01a34556585f1b4d2c/sinon.js': 'sinon.js'
  'https://raw.github.com/chaijs/chai/efc77596338556cca5fb4eade95c3838a743a186/chai.js': 'chai.js'
  'https://raw.github.com/gradus/coffeecup/2d76a48c1292629dbe961088f756f00b034f0060/lib/coffeecup.js': 'coffeekup.js'
  'https://raw.github.com/emberjs/starter-kit/1e6ee1418c694206a49bd7b021fe5996e7fdb14c/js/libs/ember-1.0.pre.js': 'ember.js'
  'https://raw.github.com/emberjs/starter-kit/1e6ee1418c694206a49bd7b021fe5996e7fdb14c/js/libs/handlebars-1.0.0.beta.6.js': 'handlebars.js'
  'https://raw.github.com/edubkendo/prettify.js/544c6cdf16594c85d3698dd0cbe07a9f232d02d9/prettify.js': 'prettify.js'
  'https://raw.github.com/Marak/Faker.js/master/Faker.js': 'faker.js'
  'https://raw.github.com/madrobby/keymaster/c61b3fef9767d4899a1732b089ca70512c9d4261/keymaster.js': 'keymaster.js'
  'https://raw.github.com/mrdoob/stats.js/master/src/Stats.js': 'stats.js'
  'http://html5shiv.googlecode.com/svn/trunk/html5.js': 'html5.js'

JAVASCRIPTS["https://raw.github.com/twitter/bootstrap/#{twitterBootstrapCommit}/js/#{javascript}.js"] = "bootstrap/#{javascript}.js" for javascript in [
  'bootstrap-alert'
  'bootstrap-button'
  'bootstrap-carousel'
  'bootstrap-collapse'
  'bootstrap-dropdown'
  'bootstrap-modal'
  'bootstrap-popover'
  'bootstrap-scrollspy'
  'bootstrap-tab'
  'bootstrap-tooltip'
  'bootstrap-transition'
  'bootstrap-typeahead'
]

STYLESHEETS =
  'http://twitter.github.com/bootstrap/assets/js/google-code-prettify/prettify.css': 'prettify.css'
  'https://raw.github.com/visionmedia/mocha/master/mocha.css': 'mocha.css'
STYLESHEETS["https://raw.github.com/twitter/bootstrap/#{twitterBootstrapCommit}/less/#{stylesheet}.less"] = "bootstrap/#{stylesheet}.less" for stylesheet in [
  'accordion'
  'alerts'
  'bootstrap'
  'breadcrumbs'
  'button-groups'
  'buttons'
  'carousel'
  'close'
  'code'
  'component-animations'
  'dropdowns'
  'forms'
  'grid'
  'hero-unit'
  'labels-badges'
  'layouts'
  'mixins'
  'modals'
  'navbar'
  'navs'
  'pager'
  'pagination'
  'popovers'
  'progress-bars'
  'reset'
  'responsive-1200px-min'
  'responsive-767px-max'
  'responsive-768px-979px'
  'responsive-navbar'
  'responsive-utilities'
  'responsive'
  'scaffolding'
  'sprites'
  'tables'
  'thumbnails'
  'tooltip'
  'type'
  'utilities'
  'variables'
  'wells'
]

IMAGES = {}
IMAGES["https://raw.github.com/twitter/bootstrap/#{twitterBootstrapCommit}/img/glyphicons-halflings.png"] = 'glyphicons-halflings.png'
IMAGES["https://raw.github.com/twitter/bootstrap/#{twitterBootstrapCommit}/img/glyphicons-halflings-white.png"] = 'glyphicons-halflings-white.png'

SWFS =
  'https://raw.github.com/LearnBoost/socket.io-client/master/dist/WebSocketMain.swf': 'WebSocketMain.swf'
  'https://raw.github.com/LearnBoost/socket.io-client/master/dist/WebSocketMainInsecure.swf': 'WebSocketMainInsecure.swf'

Tower.GeneratorAppGenerator.JAVASCRIPTS = JAVASCRIPTS
Tower.GeneratorAppGenerator.STYLESHEETS = STYLESHEETS
Tower.GeneratorAppGenerator.IMAGES      = IMAGES
Tower.GeneratorAppGenerator.SWFS        = SWFS

module.exports = Tower.GeneratorAppGenerator
