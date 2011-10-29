# Metro.js

> Metro.js &reg; is an open source web framework for the Rails-prone Node.js hackers.

## Features

- `Store` layer to all popular databases, which just normalizes the data for the `Model` layer.
  - MongoDB
  - Redis
  - [Cassandra](https://github.com/wadey/node-thrift)
  - PostgreSQL
  - CouchDB
- `Model` layer with validations, sophisticated attribute management, associations, named and chainable scopes, etc.
- `Controller` layer that works pretty much exactly like the Rails controller system.
- `View` layer which works just like Rails
- `Route` layer, which handles mapping and finding routes
- `Event` layer, for callbacks and event management [todo]
- `Asset` layer, for asset compression pipeline just like Sprockets + Rails.  Handles image sprite creation too.
- `I18n` layer [todo]
- `Spec` layer for setting up tests for your app just like Rails.
- `Generator` [todo]
- `Component` layer, for building complex forms, tables, widgets, etc. [todo]
- `Template` layer, so you can swap out any template engines.
- Can also use on the client:
  - Model
  - Route
  - Template
  - Support
- Optimized for the browser.

## Install

``` bash
npm install metro
```

## Application

``` coffeescript
class MyApp.Application extends Metro.Application
  @config.encoding = "utf-8"
  @config.filter_parameters += [:password, :password_confirmation]
  @config.autoload_paths += []
  config.i18n.load_path += Dir[File.join(Rails.root, 'config', 'locales', '**', '*.{rb,yml}')]
  
MyApp.Application.initialize!
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

Can also create CSS sprites [description coming soon]

``` coffeescript
Metro = require("metro")

# below are all of the configuration defaults
Metro.Asset.configure
  public_path:             "#{Metro.root}/public"
  load_paths:              [
    "#{Metro.root}/app/assets",
    "#{Metro.root}/lib/assets",
    "#{Metro.root}/vendor/assets"
  ]
  
  stylesheet_directory:   "stylesheets"
  stylesheet_extensions:  ["css", "styl", "scss", "less"]
  stylesheet_aliases:
    css:                  ["styl", "less", "scss", "sass"]
  
  javascript_directory:   "javascripts"
  javascript_extensions:  ["js", "coffee", "ejs"]
  javascript_aliases:
    js:                   ["coffee", "coffeescript"]
    coffee:               ["coffeescript"]
  
  image_directory:        "images"
  image_extensions:       ["png", "jpg", "gif"]
  image_aliases:
    jpg:                  ["jpeg"]
  
  font_directory:         "fonts"
  font_extensions:        ["eot", "svg", "tff", "woff"]
  font_aliases:           {}
  
  host:                   null
  relative_root_url:      null

  precompile:             []
  
  js_compressor:          null
  css_compressor:         null
  
  enabled:                true
  
  manifest:               "/public/assets"
  # live compilation
  compile:                true
  prefix:                 "assets"

```

## Routes

``` coffeescript
Metro.Route.draw ->
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
  @include Metro.Model
  
  @key "title"
  @key "body"
  @key "slug"
  @key "created_at", type: Date
  
  @validates "title", presence: true
  
  @beforeSave "parameterize"
  
  parameterize: ->
    @slug = _.parameterize(@title)
```

``` coffeescript
User.where(firstName: "=~": "a").order(["firstName", "desc"]).all()
```

## Controllers

``` coffeescript
class PostsController
  @include Metro.Controller
  
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

### Client-side Requesting

Since all of the controller/routing code is available on the client, you can go directly through that system just like you would the server.

``` coffeescript
# Just request the url, and let it do it's thing
Metro.get '/posts'

# Same thing, this time passing parameters
Metro.get '/posts', createdAt: "2011-10-26..2011-10-31"

# Dynamic
Metro.urlFor(Post.first()) #=> "/posts/the-id"
Metro.navigate Metro.urlFor(post)
```

Those methods pass through the router and client-side middleware so you have access to `request` and `response` objects like you would on the server.

## Development and Tests

``` bash
./node_modules/coffee-script/bin/coffee -o lib -w src
./node_modules/jasmine-node/bin/jasmine-node --coffee ./spec
```
