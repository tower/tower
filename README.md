# Metro.js

> Rails-esque Framework For Node.js

## Install

``` bash
npm install metro
```

## Usage

### Compression

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

Metro.Asset.compile()
```

### Routes

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

### Models

``` coffeescript
class Post
  @include Metro.Model
```

### Controllers

``` coffeescript
class PostsController
  @include Metro.ResourceController
```

## Development

``` bash
npm install uglify-js jasmine-node
coffee -c --no-wrap -o lib -w src
coffee -c -o lib -w src
./node_modules/coffee-script/bin/coffee -o lib -w src
jasmine-node --coffee spec/.
./node_modules/jasmine-node/bin/jasmine-node --coffee ./spec
cake build
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

### Other Projects

- https://github.com/c4milo/node-inotify

### Docs

- http://nodejs.org/docs/v0.3.1/api/assert.html
