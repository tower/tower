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

## Development and Tests

``` bash
./node_modules/coffee-script/bin/coffee -o lib -w src
./node_modules/jasmine-node/bin/jasmine-node --coffee ./spec
```
