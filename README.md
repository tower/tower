# Metro.js

> Fulfilling Web Development

Metro.js &reg; is an open source web framework for the Rails-prone Node.js hackers.

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
- `Event` layer, for callbacks and event management
- `Asset` layer, for asset compression pipeline just like Sprockets + Rails.  Handles image sprite creation too.
- `I18n` layer
- `Spec` layer for setting up tests for your app just like Rails.
- `Generator`
- `Component` layer, for building complex forms, tables, widgets, etc.
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

## Build

``` coffeescript
content.replace(/(\s*)\@([A-Z]\w*):\s*require\s*\(?\s*['"]([^'"]+)['"]\s*\)?/, (_, tab, name, path) ->
  lines = fs.readFileSync(path).split("\n")
  for line, index in lines
    lines[index] = "#{tab}  "
  "class @#{name}\n" + lines
```

## Events

``` coffeescript
Metro.on "attributeChange", (event) ->
  event.target
  
User.on "attributeChange"  

user.on "attributeChange"

User.on "afterCreate", (event) ->
  
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

``` coffeescript
User.where(first_name: "=~": "a").order(["first_name", "desc"]).all()
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

## Binding

It's easy to do binding from a model to a view, because we're creating the models and can dispatch events.  Without events, you have to run a timer.

Manual form:

``` coffeescript
post = new Post(title: "First Post")

Metro.bind $("#title").get(0), "innerHTML", post, "title"
Metro.bind $("title").get(0), "innerHTML", post, "title"
```

## Observer

``` coffeescript
class ImagesPresenter
  afterShow: ->
    view = $(@body)
    view.appendTo("body").popup()
    Metro.bind $(".caption", view).get(0), "innerHTML", @image, "title"
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

## Testing

- https://github.com/pivotal/jasmine/wiki/Spies

http://svt.se/ug/