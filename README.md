# Metro.js

> Attention All Passengers:  Client and server are merging...  You may now begin coding.

## Parts

- Core: Core extensions, base files, I18n
- Model + Store
- View + Controller + Middleware + Route
- Event
- Date, String, etc.

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

To install Metro with development dependencies, use:

``` bash
npm install metro --dev # npm install metro -d
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

## Tips

#### Create a namespace for your app.

This makes it so you don't have to use `require` everywhere on the client, setting the same variable over and over again.

``` coffeescript
class MyApp.User
  @include Metro.Model
```

or

``` coffeescript
class User
  @include Metro.Model

MyApp.User = User
```

Instead of

``` coffeescript
# user.coffee
class User
  @include Metro.Model

module.exports = User

# somewhere else
User = require('../app/models/user')
```

Because of the naming/folder conventions, you can get away with this without any worries.  It also decreases the final output code :)

## Generator

``` bash
metro new my-app
```

## App

``` coffeescript
# index.coffee
class Movement extends Metro.Application
```

## Routes

``` coffeescript
# config/routes.coffee
route "/login",         "sessions#new", via: "get", as: "login"
                        
route "/posts",         "posts#index", via: "get"
route "/posts/:id/edit","posts#edit", via: "get"
route "/posts/:id",     "posts#show", via: "get"
route "/posts",         "posts#create", via: "post"
route "/posts/:id",     "posts#update", via: "put"
route "/posts/:id",     "posts#destroy", via: "delete"
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
class PostsController extends Metro.Controller
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
class PageView extents Metro.Model
  @store "redis"
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
class MyApp extends Metro.Application
  @config.encoding = "utf-8"
  @config.filterParameters += ["password", "password_confirmation"]
  @config.loadPaths += ["./themes"]
  
MyApp.Application.initialize()
```

## Watchfile

## Internationalization

The default interpolator is mustache.  You can swap that out with any template engine you want.

Should use https://github.com/olado/doT, which seems to be the fastest: http://jsperf.com/dom-vs-innerhtml-based-templating/253.

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

- https://github.com/rstacruz/js2coffee
- http://momentjs.com/
- http://sugarjs.com/
- http://rickharrison.github.com/validate.js/
- https://github.com/javve/list
- http://debuggable.com/posts/testing-node-js-modules-with-travis-ci:4ec62298-aec4-4ee3-8b5a-2c96cbdd56cb
- http://dtrace.org/resources/bmc/QCon.pdf
- http://derbyjs.com/
- http://www.html5rocks.com/en/tutorials/file/filesystem/
- https://github.com/gregdingle/genetify
- https://github.com/jquery/qunit

## Presenter

``` coffeescript
PostsPresenter =
  index: ->
```

## Research

These are projects that should either be integrated into Metro, or rewritten to decrease file size.

### Database

- https://github.com/zefhemel/persistencejs

### Routes & History

- https://github.com/balupton/history.js
- https://github.com/millermedeiros/crossroads.js

### Models

- https://github.com/maccman/spine
- https://github.com/biggie/biggie-orm

### Events

- http://millermedeiros.github.com/js-signals

### Payment Gateways

- https://github.com/jamescarr/paynode
- https://github.com/braintree/braintree_node

### Mailers

- https://github.com/marak/node_mailer
