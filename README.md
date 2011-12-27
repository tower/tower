# Tower.js

> Full Stack Web Framework for Node.js and the Browser.  Minified & Gzipped: 15.7kb

## Install

``` bash
npm install tower
```

## Generator

``` bash
tower new my-app
```

## Structure

Here's how you might organize a blog:

``` bash
.
|-- app
|   |-- controllers
|   |   |-- admin
|   |   |   |-- postsController.coffee
|   |   |   `-- usersController.coffee
|   |   |-- commentsController.coffee
|   |   |-- postsController.coffee
|   |   |-- sessionsController.coffee
|   |   `-- usersController.coffee
|   |-- models
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
|       |   `-- tagsHelper.coffee
|       `-- postsHelper.coffee
`-- config
|    |-- application.coffee
|    |-- locale
|        `-- en.coffee
|    |-- routes.coffee
`-- spec
|    |-- helper.coffee
|    |-- models
|    |   |-- postSpec.coffee
|    |   |-- userSpec.coffee
|    `-- acceptance
|        |-- login.coffee
|        |-- signup.coffee
|        `-- posts.coffee
```

## Application

``` coffeescript
# config/application.coffee
class App extends Tower.Application
  @config.encoding = "utf-8"
  @config.filterParameters += ["password", "password_confirmation"]
  @config.loadPaths += ["./themes"]
  
App.initialize()
```

## Models

``` coffeescript
class App.Post extends Tower.Model
  @field "title"
  @field "body"
  @field "tags", type: ["String"], default: []
  @field "slug"
  
  @key "slug"
  
  @belongsTo "author", type: "User"
  
  @hasMany "comments", as: "commentable"
  @hasMany "commenters", through: "comments", source: "author"
  
  @before "validate", "slugify"
  
  slugify: ->
    @slug = @title.replace(/^[a-z0-9]+/g, "-").toLowerCase()
  
class App.Comment extends Tower.Model
  @field "message"
  
  @belongsTo "author", type: "User"
  @belongsTo "commentable", polymorphic: true
  
class App.User extends Tower.Model
  @field "firstName"
  @field "lastName"
  @field "email"
  @field "activatedAt", type: "Date", default: -> new Date()
  
  @hasOne "address", embed: true
  
  @hasMany "posts"
  @hasmany "comments", through: "posts"
  
  @scope "thisWeek", -> @where(createdAt: ">=": -> require('moment')().subtract('days', 7))
  
  @validate "firstName", presence: true
  
  @after "create", "welcome"
  
  welcome: ->
    Tower.Mailer.welcome(@).deliver()
  
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
User
  .where(createdAt: ">=": _(2).days().ago(), "<=": new Date())
  .within(radius: 2)
  .desc("createdAt")
  .asc("firstName")
  .paginate(page: 5)
  .all()
```

### Associations

``` coffeescript
user = User.first()

# hasMany "posts"
posts = user.posts().where(title: "First Post").first()
post  = user.posts().build(title: "A Post!")
post  = user.posts().create(title: "A Saved Post!")
posts = user.posts().all()

# hasMany "comments", through: "posts"
comments  = user.comments().where(message: /(javascript)/).limit(10).all()

# eager load associations
Post.includes("author").where(author: firstName: "=~": "Baldwin").all()
Post.includes("author").where("author.firstName": "=~": "Baldwin").all()
User.includes("posts").where("posts.title": "Welcome").all()
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

Routes are really just models, `Tower.Route`.  You can add and remove and search them however you like:

``` coffeescript
Tower.Route.where(pattern: "=~": "/posts").first()
```

## Views

### Forms

``` coffeescript
# app/views/posts/new.coffee
formFor @post, ->
  fieldset ->
    legend "Basic Info"
    field "title"
    field "body", as: "text"
  submit "Save"
```

### Tables

``` coffeescript
# app/views/posts/index.coffee
tableFor @posts, ->
  thead ->
    tcell "Title"
    tcell "Author"
  tbody ->
    for post in @posts
      trow 
        tcell post.title
        tcell post.author.name
  tfoot ->
    pagination @posts
```

### Layouts

``` coffeescript
# app/views/layouts/application.coffee
doctype 5
html ->
  head ->
    meta charset: 'utf-8'
    title "#{@title or 'Untitled'} | My awesome website"
    meta name: 'description', content: @desc if @desc?
    stylesheets "vendor", "application"
    javascripts "vendor", "lib", "application"
  body ->
    header ->
      h1 @title or 'Untitled'
      nav ->
        ul ->
          (li -> a href: '/', -> 'Home') unless @path is '/'
          li -> a href: '/chunky', -> 'Bacon!'
          switch @user.role
            when 'owner', 'admin'
              li -> a href: '/admin', -> 'Secret Stuff'
            when 'vip'
              li -> a href: '/vip', -> 'Exclusive Stuff'
            else
              li -> a href: '/commoners', -> 'Just Stuff'
    section ->
      yield()
    footer ->
      p shoutify('bye')
```

The default templating engine is [CoffeeKup](http://coffeekup.org/), which is pure coffeescript.  It's much more powerful than Jade, and it's just as performant if not more so.  You can set Jade or any other templating engine as the default by setting `Tower.View.engine = "jade"` in `config/application`.  Tower uses [Shift.js](http://github.com/viatropos/shift.js), which is a normalized interface to most of the Node.js templating languages.

## Controllers

``` coffeescript
class PostsController extends Tower.Controller
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

Actually, all that's built in!  So for the simple case you don't even need to write anything in your controllers (skinny controllers, fat models).

## Mailers

``` coffeescript
class App.Notification extends Tower.Mailer
  # app/views/mailers/welcome.coffee template
  @welcome: (user) ->
    @mail to: user.email, from: "me@gmail.com"
```

## Internationalization

``` coffeescript
en:
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
Tower.navigate Tower.urlFor(post)
```

Those methods pass through the router and client-side middleware so you have access to `request` and `response` objects like you would on the server.

## Middleware

It's built on [connect](http://github.com/sencha/connect), so you can use any of the middleware libs out there.

## Assets

``` coffeescript
# config/assets.coffee
Tower.assets =
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

## Test, Develop, Minify

``` bash
cake spec
cake coffee
cake minify
```

## License

(The MIT License)

Copyright &copy; 2012 [Lance Pollard](http://twitter.com/viatropos) &lt;lancejpollard@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
