# Metro.js

> Rails-esque Framework For Node.js (just hacking for now)

## Install

``` bash
npm install metro
```

## Generate an App

(or just setup the files manually, I like that better)

``` bash
metro new my-app
```

## Assets

This

``` javascript
//= require ./spec/fixtures/javascripts/directive_child_a.js
//= require ./spec/fixtures/javascripts/directive_child_b.js

alert("directives");
```

...becomes

``` javascript
alert("directive a");
alert("directive b");
alert("directives");
```

### Asset Compression

``` coffeescript
Metro = require("metro")

Metro.configure ->
  @assets.path            = "./public/assets"
  @assets.css_compressor  = "yui"
  @assets.js_compressor   = "uglifier"
  @assets.js              = ["application.js"]
  @assets.css             = ["application.css", "theme.css"]
  @assets.css_paths       = ["./app/assets/stylesheets"]
  @assets.js_paths        = ["./app/assets/javascripts"]

Metro.Assets.compile()
```

### Inject Raw Assets into the HTML Source

``` coffeescript
app     = Metro.Application.instance()
script  = (source) -> app.assets().find(source).read()
```

``` html
<!DOCTYPE html>
<html>
  <head>
    <script src="/javascripts/application.js" type="text/javascript"></script>
    <script type="text/javascript">
      #{script("application.js")}
    </script>
  </head>
  <body>
  </body>
</html>
```

## Routes

``` coffeescript
Metro.Application.routes().draw ->
  @match "/login",          to: "sessions#new", via: "get", as: "login"
  
  @match "/posts",          to: "posts#index", via: "get"
  @match "/posts/:id/edit", to: "posts#edit", via: "get"
  @match "/posts/:id",      to: "posts#show", via: "get"
  @match "/posts",          to: "posts#create", via: "post"
  @match "/posts/:id",      to: "posts#update", via: "put"
  @match "/posts/:id",      to: "posts#destroy", via: "delete"
```

## Models

``` coffeescript
class Post
  @include Metro.Models.Base
  
  @key "title"
  @key "body"
  @key "slug"
  @key "created_at", type: Date
  
  @validates "title", presence: true
  
  @before_save "parameterize"
  
  parameterize: ->
    @slug = _.parameterize(@title)
```

## Controllers

``` coffeescript
class PostsController
  @include Metro.Controllers.Base
  
  index: ->
    @posts = Post.all()
    
  new: ->
    @post = Post.new
    
  create: ->
    @post = Post.new(@params.post)
    
    super (success, failure) ->
      @success.html -> @render "posts/edit"
      @success.json -> @render text: "success!"
      @failure.html -> @render text: "Error", status: 404
      @failure.json -> @render text: "Error", status: 404
    
  show: ->
    @post = Post.find(@params.id)
    
  edit: ->
    @post = Post.find(@params.id)
    
  update: ->
    @post = Post.find(@params.id)
    
  destroy: ->
    @post = Post.find(@params.id)
```

## Development

``` bash
npm install uglify-js jasmine-node
coffee -c --no-wrap -o lib -w src
coffee -c -o lib -w src
./node_modules/coffee-script/bin/coffee -o lib -w src
jasmine-node --coffee spec/.
./node_modules/jasmine-node/bin/jasmine-node --coffee ./spec
./node_modules/docco/bin/docco src/*.coffee
cake build
delete require.cache['/home/shimin/test2.js']
```

## Todo

- css sprites
- upload assets to amazon
- asset manifest
- better asset watcher
- asset server
- asset digest in name
- asset helpers

- route regular expressions
- params parser
- query parser

- view lookups
- partial lookups

- development environment reload

- json api with presenters
- view responders
- view layouts

- resourceful controller
- resourceful routes

- internationalization

``` javascript
var stack = new Error().stack
require("sys").puts( stack )
```

## Resources

### Projects

- https://github.com/rails/rails
- https://github.com/senchalabs/connect
- https://github.com/1602/express-on-railway
- https://github.com/mauricemach/zappa
- https://github.com/mde/geddy
- https://github.com/rails/rails/tree/master/actionpack/lib/sprockets
- https://github.com/Tim-Smart/node-asset/blob/master/src/index.coffee
- https://github.com/craigspaeth/nap
- https://github.com/mape/connect-assetmanager
- https://github.com/cjohansen/juicer/
- https://github.com/One-com/assetgraph
- https://github.com/mishoo/UglifyJS/
- https://github.com/TrevorBurnham/connect-assets
- https://github.com/TrevorBurnham/snockets
- https://github.com/TrevorBurnham/snockets/blob/master/src/snockets.coffee
- https://github.com/sstephenson/sprockets
- https://github.com/stoyan/yuicompressor/blob/master/ports/js/cssmin.js
- https://github.com/maccman/spine/blob/master/src/spine.coffee
- https://github.com/chriso/packnode
- https://github.com/joyent/node/wiki/modules
- https://github.com/cloudhead/eyes.js
- https://github.com/cloudhead/hijs
- https://github.com/jakesgordon/sprite-factory/

- https://github.com/LearnBoost/juice (inject styles to html for emails)
- http://visionmedia.github.com/nib/ (cross browser css)

### Articles

- http://imulus.com/blog/casey/javascript/coffeescript-namespaces-modules-and-inheritance/
- https://github.com/jashkenas/coffee-script/wiki/FAQ
- https://github.com/joyent/node/wiki/modules
- http://npmjs.org/doc/developers.html
- https://developer.mozilla.org/en/JavaScript/Reference/Functions_and_function_scope
- https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function#Methods_2
- http://matchingnotes.com/coffeescript-and-the-number-prototype
- https://github.com/jashkenas/coffee-script/wiki/Mixins
- https://github.com/jashkenas/coffee-script/wiki/%5BExtensibility%5D-Writing-DSLs
- https://github.com/jashkenas/coffee-script/wiki/Easy-modules-with-CoffeeScript
- http://shinetech.com/thoughts/thought-articles/139-asynchronous-code-design-with-nodejs-
- http://blog.monitis.com/index.php/2011/07/09/6-node-js-recipes-working-with-the-file-system/
- http://nodejs.org/docs/v0.4.7/api/events.html
- http://elegantcode.com/2011/04/06/taking-baby-steps-with-node-js-pumping-data-between-streams/
- https://github.com/visionmedia/express/blob/master/lib/router/route.js
- http://redis.io/topics/memory-optimization
- http://stackoverflow.com/questions/4768748/requireing-a-coffeescript-file-from-a-javascript-file-or-repl
- http://stackoverflow.com/questions/1972242/auto-reload-of-files-in-node-js
- https://github.com/guille/jsconf-todo-demo/blob/master/server.js
- http://michaux.ca/articles/the-command-pattern-in-javascript-encapsulating-function-property-calls
- https://github.com/eriwen/javascript-stacktrace
- https://github.com/caolan/quip
- https://github.com/paulca/eyeballs.js
- http://stackoverflow.com/questions/3601080/how-do-i-pass-content-from-a-template-to-a-layout-in-express
- http://stackoverflow.com/questions/7042340/node-js-error-cant-set-headers-after-they-are-sent

### Other Projects

- https://github.com/c4milo/node-inotify
- https://github.com/technoweenie/coffee-resque
- https://github.com/LearnBoost/mongoose
- https://github.com/LearnBoost/kue
- https://github.com/LearnBoost/knox (s3)
- https://github.com/visionmedia/node-querystring
- https://github.com/felixge/node-formidable
- https://github.com/visionmedia/davis.js
- digest: https://github.com/brainfucker/hashlib
- https://github.com/sstephenson/hike/blob/master/lib/hike/trail.rb
- https://github.com/ryanmcgrath/wrench-js
- https://github.com/joyent/libuv
- https://github.com/mikeal/watch
- https://github.com/hij1nx/EventEmitter2
- https://github.com/jeromeetienne/microevent.js/blob/master/microevent.js#L12-31
- https://github.com/pkrumins/node-lazy
- https://github.com/masylum/dialect/
- https://github.com/naholyr/node-jus-i18n
- https://github.com/mashpie/i18n-node
- https://github.com/substack/node-findit
- https://github.com/cloudhead/node-static
- https://github.com/hookio/hook.io
- http://bricksjs.com/index.html
- https://github.com/substack/node-browserify
- https://github.com/substack/js-traverse
- https://github.com/substack/mrcolor
- https://github.com/substack/node-jadeify
- https://github.com/cliftonc/calipso
- https://github.com/joyent/node/wiki/modules#wiki-templating
- https://github.com/visionmedia/lingo
- https://github.com/isaacs/abbrev-js/
- https://github.com/maritz/node-sprintf
- https://github.com/visionmedia/dox
- npm install sprintf
- http://rejex.heroku.com/

## Gists

``` javascript
require.paths.unshift(__dirname + '/support/express/lib/',
                      __dirname + '/support/express/support/connect/lib',
                      __dirname + '/support/socket.io/lib/',
                      __dirname + '/support/nodestream/lib/',
                      __dirname + '/support/mongoose/',
                      __dirname + '/support/jade/lib/');
```

### Docs

- http://nodejs.org/docs/v0.3.1/api/assert.html

http://svt.se/ug/