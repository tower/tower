# Tower.js <img src="http://i.imgur.com/e3VLW.png"/>

> Full Stack Web Framework for Node.js and the Browser.

Built on top of Node's Connect and Express, modeled after Ruby on Rails.  Built for the client and server from the ground up.

[![Build Status](https://secure.travis-ci.org/viatropos/tower.png)](http://travis-ci.org/viatropos/tower)

Follow me [@viatropos](http://twitter.com/viatropos).

Docs are a work in progress.

## Default Development Stack

- MongoDB (database)
- Redis (background jobs)
- CoffeeScript
- Stylus (LESS is also supported)
- Mocha (tests)
- jQuery

Includes a database-agnostic ORM with browser (memory) and MongoDB support, modeled after ActiveRecord and Mongoid for Ruby.  Includes a controller architecture that works the same on both the client and server, modeled after Rails.  The routing API is pretty much exactly like Rails 3's.  Templates work on client and server as well (and you can swap in any template engine no problem).  Includes asset pipeline that works just like Rails 3's - minifies and gzips assets with an md5-hashed name for optimal browser caching, only if you so desire.  And it includes a watcher that automatically injects javascripts and stylesheets into the browser as you develop.  It solves a lot of our problems, hope it solves yours too.

## Install

``` bash
sudo npm install design.io -g
npm install tower -g
```

## Generate

``` bash
tower new app
cd app
sudo npm install
tower generate scaffold Post title:string body:text
node server
```

If you run into an error during `npm install`, remove the `node_modules` folder and try again.

To restart your server automatically if it crashes, run with forever:

```
npm install forever -g
forever server.js
```

## Structure

Here's how you might organize a blog:

``` bash
.
|-- app
|   |-- client
|   |   |-- stylesheets
|   |-- controllers
|   |   |-- admin
|   |   |   |-- postsController.coffee
|   |   |   `-- usersController.coffee
|   |   |-- commentsController.coffee
|   |   |-- postsController.coffee
|   |   |-- sessionsController.coffee
|   |   `-- usersController.coffee
|   |-- models
|   |   |-- comment.coffee
|   |   |-- post.coffee
|   |   `-- user.coffee
|   |-- views
|   |   |-- admin
|   |   |   `-- posts
|   |   |       |-- _form.coffee
|   |   |       |-- edit.coffee
|   |   |       |-- index.coffee
|   |   |       |-- new.coffee
|   |   |       |-- show.coffee
|   |   |-- layouts
|   |   |   `-- application.coffee
|   |   |-- shared
|   |   `-- posts
|   |       |-- index.coffee
|   |       `-- show.coffee
|   `-- helpers
|       |-- admin
|       |   |-- postsHelper.coffee
|       |   `-- usersHelper.coffee
|       `-- postsHelper.coffee
`-- config
|    |-- application.coffee
|    |-- assets.coffee
|    |-- databases.coffee
|    |-- environments
|       |-- development
|       |-- production
|       `-- test
|    |-- locale
|       `-- en.coffee
|    |-- routes.coffee
`-- test
|    |-- helper.coffee
|    |-- models
|    |   |-- postTest.coffee
|    |   |-- userTest.coffee
|    `-- acceptance
|        |-- login.coffee
|        |-- signup.coffee
|        `-- posts.coffee
```

## Application

``` coffeescript
# config/application.coffee
class App extends Tower.Application
  @configure ->
    @use "favicon", Tower.publicPath + "/favicon.ico"
    @use "static",  Tower.publicPath, maxAge: Tower.publicCacheDuration
    @use "profiler" if Tower.env != "production"
    @use "logger"
    @use "query"
    @use "cookieParser", Tower.session.secret
    @use "session", Tower.session.key
    @use "bodyParser"
    @use "csrf"
    @use "methodOverride", "_method"
    @use Tower.Middleware.Agent
    @use Tower.Middleware.Location
    @use Tower.Middleware.Router

module.exports = global.App = App
```

## Models

``` coffeescript
# app/models/user.coffee
class App.User extends Tower.Model
  @field "firstName", required: true
  @field "lastName"
  @field "email", format: /\w+@\w+.com/
  @field "activatedAt", type: "Date", default: -> new Date()
  
  @hasOne "address", embed: true
  
  @hasMany "posts"
  @hasMany "comments"
  
  @scope "recent", -> createdAt: ">=": -> _(3).days().ago().toDate()
  
  @validates "firstName", "email", presence: true
  
  @after "create", "welcome"
  
  welcome: ->
    Tower.Mailer.welcome(@).deliver()
```
``` coffeescript
# app/models/post.coffee
class App.Post extends Tower.Model
  @field "title"
  @field "body"
  @field "tags", type: ["String"], default: []
  @field "slug"
  
  @belongsTo "author", type: "User"
  
  @hasMany "comments", as: "commentable"
  @hasMany "commenters", through: "comments", type: "User"
  
  @before "validate", "slugify"
  
  slugify: ->
    @set "slug", @get("title").replace(/[^a-z0-9]+/g, "-").toLowerCase()
```
``` coffeescript
# app/models/comment.coffee
class App.Comment extends Tower.Model
  @field "message"
  
  @belongsTo "author", type: "User"
  @belongsTo "commentable", polymorphic: true
```
``` coffeescript
# app/models/address.coffee
class App.Address extends Tower.Model
  @field "street"
  @field "city"
  @field "state"
  @field "zip"
  @field "coordinates", type: "Geo"
  
  @belongsTo "user", embed: true
```

### Chainable Scopes, Queries, and Pagination

``` coffeescript
App.User
  .where(createdAt: ">=": _(2).days().ago(), "<=": new Date())
  .desc("createdAt")
  .asc("firstName")
  .paginate(page: 5)
  .all()
```

### Associations

``` coffeescript
user  = App.User.first()

# hasMany "posts"
posts = user.posts().where(title: "First Post").first()
post  = user.posts().build(title: "A Post!")
post  = user.posts().create(title: "A Saved Post!")
posts = user.posts().all()

post  = App.Post.first()

# belongsTo "author"
user  = post.author()
```

### Validations

``` coffeescript
user = new User
user.save() #=> false
user.errors #=> {"email": ["Email must be present"]}
user.email  = "me@gmail.com"
user.save() #=> true
user.errors #=> {}
```

## Routes

``` coffeescript
# config/routes.coffee
Tower.Route.draw ->
  @match "/login", "sessions#new", via: "get", as: "login"
  @match "/logout", "sessions#destroy", via: "get", as: "logout"
  
  @resources "posts", ->
    @resources "comments"
    
  @namespace "admin", ->
    @resources "users"
    @resources "posts", ->
      @resources "comments"
      
  @constraints subdomain: /^api$/, ->
    @resources "posts", ->
      @resources "comments"
      
  @match "(/*path)", to: "application#index", via: "get"
```

## Views

Views adhere to the [Twitter Bootstrap 2.x](http://twitter.github.com/bootstrap/) markup conventions.

### Forms

``` coffeescript
# app/views/posts/new.coffee
formFor "post", (f) ->
  f.fieldset (fields) ->
    fields.field "title", as: "string"
    fields.field "body", as: "text"
  
  f.fieldset (fields) ->
    fields.submit "Submit"
```

### Tables

``` coffeescript
# app/views/posts/index.coffee
tableFor "posts", (t) ->
  t.head ->
    t.row ->
      t.cell "title", sort: true
      t.cell "body", sort: true
      t.cell()
      t.cell()
      t.cell()
  t.body ->
    for post in @posts
      t.row ->
        t.cell post.get("title")
        t.cell post.get("body")
        t.cell linkTo 'Show', post
        t.cell linkTo 'Edit', Tower.urlFor(post, action: "edit")
        t.cell linkTo 'Destroy', post, method: "delete"
  linkTo 'New Post', Tower.urlFor(App.Post, action: "new")
```

### Layouts

``` coffeescript
# app/views/layouts/application.coffee
doctype 5
html ->
  head ->
    meta charset: "utf-8"

    title t("title")

    meta name: "description", content: t("description")
    meta name: "keywords", content: t("keywords")
    meta name: "robots", content: t("robots")
    meta name: "author", content: t("author")

    csrfMetaTag()

    appleViewportMetaTag width: "device-width", max: 1, scalable: false
    
    stylesheets "lib", "vendor", "application"

    javascriptTag "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"
    javascripts "vendor", "lib", "application"
  
  body role: "application", ->
    if hasContentFor "templates"
      yield "templates"
      
    nav id: "navigation", role: "navigation", ->
      div class: "frame", ->
        partial "shared/navigation"
        
    header id: "header", role: "banner", ->
      div class: "frame", ->
        partial "shared/header"
        
    section id: "body", role: "main", ->
      div class: "frame", ->
        yields "body"
        aside id: "sidebar", role: "complementary", ->
          if hasContentFor "sidebar"
            yields "sidebar"
            
    footer id: "footer", role: "contentinfo", ->
      div class: "frame", ->
        partial "shared/footer"
        
  if hasContentFor "popups"
    aside id: "popups", ->
      yields "popups"
      
  if hasContentFor "bottom"
    yields "bottom"
```

The default templating engine is [CoffeeKup](http://coffeekup.org/), which is pure CoffeeScript.  It's much more powerful than Jade, and it's just as performant if not more so.  You can set Jade or any other templating engine as the default by setting `Tower.View.engine = "jade"` in `config/application`.  Tower uses [Mint.js](http://github.com/viatropos/mint.js), which is a normalized interface to most of the Node.js templating languages.

## Styles

It's all using Twitter Bootstrap, so check out their docs.  http://twitter.github.com/bootstrap/

## Controllers

``` coffeescript
# app/controllers/postsController.coffee
class App.PostsController extends Tower.Controller
  index: ->
    App.Post.all (error, posts) =>
      @render "index", locals: posts: posts
    
  new: ->
    @post = new App.Post
    @render "new"
    
  create: ->
    @post = new App.Post(@params.post)
    
    super (success, failure) ->
      @success.html => @render "posts/edit"
      @success.json => @render text: "success!"
      @failure.html => @render text: "Error", status: 404
      @failure.json => @render text: "Error", status: 404
    
  show: ->
    App.Post.find @params.id, (error, post) =>
      @render "show"
    
  edit: ->
    App.Post.find @params.id, (error, post) =>
      @render "edit"
    
  update: ->
    App.Post.find @params.id, (error, post) =>
      post.updateAttributes @params.post, (error) =>
        @redirectTo action: "show"
    
  destroy: ->
    App.Post.find @params.id, (error, post) =>
      post.destroy (error) =>
        @redirectTo action: "index"
```

Actually, all that's built in!  So for the simple case you don't even need to write anything in your controllers (skinny controllers, fat models).  The default implementation is actually a lot more robust than that, just wanted to show a simple example.

## Databases

``` coffeescript
# config/databases.coffee
module.exports =
  mongodb:
    development:
      name: "app-development"
      port: 27017
      host: "127.0.0.1"
    test:
      name: "app-test"
      port: 27017
      host: "127.0.0.1"
    staging:
      name: "app-staging"
      port: 27017
      host: "127.0.0.1"
    production:
      name: "app-production"
      port: 27017
      host: "127.0.0.1"
```

## Mailers

``` coffeescript
class App.Notification extends Tower.Mailer
  # app/views/mailers/welcome.coffee template
  @welcome: (user) ->
    @mail to: user.email, from: "me@gmail.com"
```

## Internationalization

``` coffeescript
# config/locales/en.coffee
module.exports =
  hello: "world"
  forms:
    titles:
      signup: "Signup"
  pages:
    titles:
      home: "Welcome to %{site}"
  posts:
    comments:
      none: "No comments"
      one: "1 comment"
      other: "%{count} comments"
  messages:
    past:
      none: "You never had any messages"
      one: "You had 1 message"
      other: "You had %{count} messages"
    present:
      one: "You have 1 message"
    future:
      one: "You might have 1 message"
```

## Helpers

Since all of the controller/routing code is available on the client, you can go directly through that system just like you would the server.

``` coffeescript
# Just request the url, and let it do it's thing
Tower.get '/posts'

# Same thing, this time passing parameters
Tower.get '/posts', createdAt: "2011-10-26..2011-10-31"

# Dynamic
Tower.urlFor(Post.first()) #=> "/posts/the-id"
```

Those methods pass through the router and client-side middleware so you have access to `request` and `response` objects like you would on the server.

## Middleware

It's built on [connect](http://github.com/sencha/connect), so you can use any of the middleware libs out there.

## Assets

``` coffeescript
# config/assets.coffee
module.exports =
  javascripts:
    vendor: [
      "/vendor/javascripts/jquery.js"
      "/vendor/javascripts/underscore.js"
      "/vendor/javascripts/socket.io"
      "/vendor/javascripts/tower.js"
    ]
    
    lib: [
      "/lib/grid.js"
      "/lib/profiler.js"
    ]
    
    application: [
      "/app/models/post.js"
      "/app/models/comment.js"
    ]
    
  stylesheets:
    vendor: [
      "/vendor/stylesheets/reset.css"
    ]
    application: [
      "/app/assets/stylesheets/application.css"
      "/app/assets/stylesheets/theme.css"
    ]
```

All assets are read from `/public`, which is the compiled output of everything in `/app`, `/lib`, `/vendor`, and wherever else you might put things.  The default is to use stylus for css in `/app/assets/stylesheets`.

By having this `assets.coffee` file, you can specify exactly how you want to compile your files for the client so it's as optimized and cacheable as possible in production.

### Minify and Gzip

``` bash
cake assets:compile
```

### Push to S3

``` bash
cake assets:publish
```

## Watchfile

``` coffeescript
require('design.io').extension('watchfile')

# stylesheet watcher
require("design.io-stylesheets")
  ignore: /(public|node_modules|zzz|less)/
  outputPath: (path) ->
    "public/stylesheets/#{path}".replace(/\.(css|styl|less)$/, ".css")

# javascript watcher
require("design.io-javascripts")
  ignore:   /(public|node_modules|server|spec.*[sS]pec)/
  outputPath: (path) ->
    "public/javascripts/#{path}".replace(/\.(js|coffee)$/, ".js")
    
watch /app\/views\/.+\.mustache/
  update: (path) ->
    # do anything!
```

## Test

``` bash
npm test
```

## Examples

- [towerjs.org (project site)](https://github.com/viatropos/towerjs.org)

## Accent Libraries

Tower.js is just the bare bones, so you're free to choose a date parsing library, a template engine, or a form validation library, whatever.

Here's some other useful libraries:

- [moment.js](http://momentjs.com/) for date parsing
- [underscore.js](http://documentcloud.github.com/underscore/)
- [socket.io](http://socket.io/) for web sockets.
- [async.js](https://github.com/caolan/async) for taming callback spaghetti
- [geolib](https://github.com/manuelbieh/Geolib) for geo calculations
- [tiny-require.js](https://github.com/viatropos/tiny-require.js) for using `require()` in the browser
- [mint.js](https://github.com/viatropos/mint.js) for a generic interface to the JavaScript template engines

## License

(The MIT License)

Copyright &copy; 2012 [Lance Pollard](http://twitter.com/viatropos) &lt;lancejpollard@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.