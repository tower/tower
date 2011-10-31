# Metro.js

> Web Framework for the Rails-prone Node.js hackers.

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
- `Template` layer, so you can swap out any template engines. In the [Node.js Shift Module](https://github.com/viatropos/shift.js).
- Can also use on the client:
  - Model
  - View
  - Controller
  - Route
  - Template
  - Support
- Optimized for the browser.

## Install

``` bash
npm install metro
```

## Structure

``` bash
.
|-- app
|   |-- controllers
|   |   |-- admin
|   |   |   |-- posts_controller.coffee
|   |   |   `-- users_controller.coffee
|   |   |-- posts_controller.coffee
|   |   |-- sessions_controller.coffee
|   |   `-- users_controller.coffee
|   |-- models
|   |   |-- post.coffee
|   |   `-- user.coffee
|   |-- views
|   |   |-- admin
|   |   |   `-- posts
|   |   |       |-- edit.jade
|   |   |       |-- index.jade
|   |   |       |-- new.jade
|   |   |-- layouts
|   |   |   `-- application.jade
|   |   |-- shared
|   |   `-- posts
|   |       |-- index.jade
|   |       `-- show.jade
|   |-- observers
|   |   |-- posts_observer.coffee
|   |   |-- sessions_observer.coffee
|   |   `-- users_observer.coffee
|   `-- helpers
|       |-- admin
|       |   |-- posts_helper.coffee
|       |   `-- tags_helper.coffee
|       `-- posts_helper.coffee
`-- config
|    |-- application.coffee
|    |-- locale
|        `-- en.coffee
|    |-- routes.coffee
`-- spec
|    |-- helper.coffee
|    |-- models
|    |   |-- post_spec.coffee
|    |   |-- user_spec.coffee
|    `-- acceptance
|        |-- login.coffee
|        |-- signup.coffee
|        `-- posts.coffee
```

## Generator

``` bash
metro new my-app
```

## Routes

``` coffeescript
# config/routes.coffee
Metro.Route.draw ->
  @match "/login",          to: "sessions#new", via: "get", as: "login"
  
  @match "/posts",          to: "posts#index", via: "get"
  @match "/posts/:id/edit", to: "posts#edit", via: "get"
  @match "/posts/:id",      to: "posts#show", via: "get"
  @match "/posts",          to: "posts#create", via: "post"
  @match "/posts/:id",      to: "posts#update", via: "put"
  @match "/posts/:id",      to: "posts#destroy", via: "delete"
```

Routes are really just models, `Metro.Route`.  You can add and remove and search them however you like:

``` coffeescript
Metro.Route.where(pattern: "=~": "/posts").first()
```

## Models

``` coffeescript
class User
  @include Metro.Model
  
  @key "id"
  @key "firstName"
  @key "createdAt", type: "time"
  
  @scope "byMrBaldwin", @where firstName: "=~": "Baldwin"
  @scope "thisWeek", @where createdAt: ">=": -> Metro.Support.Time.now().beginningOfWeek().toDate()
  
  @hasMany "posts", className: "Page"
  
  @validates "firstName", presence: true
```

Models have:

- validations
- named (and chainable) scopes
- attributes
- associations
- callbacks

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
    @post = new Post
    
  create: ->
    @post = new Post(@params.post)
    
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

## Store

There's a unified interface to the different types of stores, so you can use the model and have it transparently manage data.  For example, for the browser, you can use the memory store, and for the server, you can use the mongodb store.  Redis, PostgreSQL, and Neo4j are in the pipeline.

``` coffeescript
class PageView
  @include Metro.Model
  
  @store: ->
    @_store ?= new Metro.Store.Redis
```

## Views

Use any template framework for your views.  Includes [shift.js](http://github.com/viatropos/shift.js) which is a normalized interface on most of the Node.js templating languages.

Soon will add form and table builders.

## Web Sockets

Web Sockets work just like actions in controllers, using socket.io.

``` coffeescript
class ConnectionsController
  new: ->
    @emit text: "Welcome!"
  
  create: ->
    @broadcast user: params.id, text: params.text
    
  destroy: ->
    @emit text: "Adios"
```

## Middleware

It's built on [connect](http://github.com/sencha/connect), so you can use any of the middleware libs out there.

## History

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

## Application

``` coffeescript
# config/application.coffee
class MyApp.Application extends Metro.Application
  @config.encoding = "utf-8"
  @config.filterParameters += ["password", "password_confirmation"]
  @config.loadPaths += ["./themes"]
  
MyApp.Application.initialize()
```

## Assets

``` coffeescript
# below are all of the configuration defaults
Metro.Asset.configure
  publicPath:             "#{Metro.root}/public"
  loadPaths:              [
    "#{Metro.root}/app/assets",
    "#{Metro.root}/lib/assets",
    "#{Metro.root}/vendor/assets"
  ]
  
  stylesheetDirectory:   "stylesheets"
  stylesheetExtensions:  ["css", "styl", "scss", "less"]
  stylesheetAliases:
    css:                  ["styl", "less", "scss", "sass"]
  
  javascriptDirectory:   "javascripts"
  javascriptExtensions:  ["js", "coffee", "ejs"]
  javascriptAliases:
    js:                   ["coffee", "coffeescript"]
    coffee:               ["coffeescript"]
  
  imageDirectory:        "images"
  imageExtensions:       ["png", "jpg", "gif"]
  imageAliases:
    jpg:                  ["jpeg"]
  
  fontDirectory:         "fonts"
  fontExtensions:        ["eot", "svg", "tff", "woff"]
  fontAliases:           {}
  
  host:                   null
  relativeRootUrl:      null

  precompile:             []
  
  jsCompressor:          null
  cssCompressor:         null
  
  enabled:                true
  
  manifest:               "/public/assets"
  # live compilation
  compile:                true
  prefix:                 "assets"
```

## Internationalization

The default interpolator is mustache.  You can swap that out with any template engine you want.

``` coffeescript
en:
  hello: "world"
  forms:
    titles:
      signup: "Signup"
  pages:
    titles:
      home: "Welcome to {{site}}"
  posts:
    comments:
      none: "No comments"
      one: "1 comment"
      other: "{{count}} comments"
  messages:
    past:
      none: "You never had any messages"
      one: "You had 1 message"
      other: "You had {{count}} messages"
    present:
      one: "You have 1 message"
    future:
      one: "You might have 1 message"
```

## Test, Development, Minify

``` bash
cake coffee
cake spec
cake minify
```
