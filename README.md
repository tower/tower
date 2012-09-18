# Tower.js <img src="http://cloud.github.com/downloads/viatropos/tower/tower.png"/>

> Full Stack Web Framework for Node.js and the Browser.

Built on top of Node's Connect and Express, modeled after Ruby on Rails.  Built for the client and server from the ground up.

[![Build Status](https://secure.travis-ci.org/viatropos/tower.png)](http://travis-ci.org/viatropos/tower)

Follow me [@viatropos](http://twitter.com/viatropos).

- **IRC**: #towerjs on irc.freenode.net
- **Ask a question**: http://stackoverflow.com/questions/tagged/towerjs
- **Issues**: https://github.com/viatropos/tower/issues
- **Roadmap**: https://github.com/viatropos/tower/blob/master/ROADMAP.md
- **Latest Docs**: https://github.com/viatropos/tower-docs

Note, Tower is still very early alpha. Check out the [roadmap](https://github.com/viatropos/tower/blob/master/ROADMAP.md) to see where we're going. If your up for it please contribute! The 0.5.0 release will have most of the features and will be roughly equivalent to a beta release. From there, it's performance optimization, workflow streamlining, and creating some awesome examples. 1.0 will be a plug-and-chug real-time app framework.

Master branch will always be functional, and for the most part in sync with the version installed through the npm registry.

## Default Development Stack

- Ember
- jQuery
- Handlebars (templating)
- Stylus (LESS is also supported)
- MongoDB (database)
- Redis (background jobs)
- Mocha (tests)
- CoffeeScript
- Twitter Bootstrap

Includes a database-agnostic ORM with browser (memory and ajax) and MongoDB support, modeled after ActiveRecord and Mongoid for Ruby.  Includes a controller architecture that works the same on both the client and server, modeled after Rails.  The routing API is pretty much exactly like Rails 3's.  Templates work on client and server as well (and you can swap in any template engine no problem).  Includes asset pipeline that works just like Rails 3's - minifies and gzips assets with an md5-hashed name for optimal browser caching, only if you so desire.  And it includes a watcher that automatically injects javascripts and stylesheets into the browser as you develop.  It solves a lot of our problems, hope it solves yours too.

## Install

```
npm install tower -g
```

You can grab the latest client tower.js [here](http://cloud.github.com/downloads/viatropos/tower/tower.js), although you don't need to (when you generate a new app it will be downloaded automatically).

You will also need [grunt](https://github.com/cowboy/grunt), an awesome build tool:

```
npm install grunt -g
```

Finally, make sure you have mongodb installed and running:

```
brew install mongodb
mongod # starts server
```

If you would like to try out the background-worker code, you can also install and start redis:

```
brew install redis
redis-server
```

## Generate

```
tower new app
cd app
npm install
cake watch
tower generate scaffold Post title:string body:text
tower generate scaffold User firstName:string lastName:string email:string
node server
```

If you run into an error during `npm install`, remove the `node_modules` folder and try again.

To restart your server automatically if it crashes, run with forever:

```
npm install forever -g
forever server.js
```

## Application

``` coffeescript
# app/config/shared/application.coffee
global.App = Tower.Application.create()
```

## Models

``` coffeescript
# app/models/shared/user.coffee
class App.User extends Tower.Model
  @field 'firstName', required: true
  @field 'lastName'
  @field 'email', format: /\w+@\w+.com/
  @field 'activatedAt', type: 'Date', default: -> new Date()
  
  @hasOne 'address', embed: true
  
  @hasMany 'posts'
  @hasMany 'comments'
  
  @scope 'recent', -> createdAt: '>=': -> _(3).days().ago().toDate()
  
  @validates 'firstName', 'email', presence: true
  
  @after 'create', 'welcome'
  
  welcome: ->
    Tower.Mailer.welcome(@).deliver()
```

``` coffeescript
# app/models/shared/post.coffee
class App.Post extends Tower.Model
  @field 'title'
  @field 'body'
  @field 'tags', type: ['String'], default: []
  @field 'slug'
  
  @belongsTo 'author', type: 'User'
  
  @hasMany 'comments', as: 'commentable'
  @hasMany 'commenters', through: 'comments', type: 'User'
  
  @before 'validate', 'slugify'
  
  slugify: ->
    @set 'slug', @get('title').replace(/[^a-z0-9]+/g, '-').toLowerCase()
```

``` coffeescript
# app/models/shared/comment.coffee
class App.Comment extends Tower.Model
  @field 'message'
  
  @belongsTo 'author', type: 'User'
  @belongsTo 'commentable', polymorphic: true
```

``` coffeescript
# app/models/shared/address.coffee
class App.Address extends Tower.Model
  @field 'street'
  @field 'city'
  @field 'state'
  @field 'zip'
  @field 'coordinates', type: 'Geo'
  
  @belongsTo 'user', embed: true
```

### Chainable Scopes, Queries, and Pagination

``` coffeescript
App.User
  .where(createdAt: '>=': _(2).days().ago(), '<=': new Date())
  .desc('createdAt')
  .asc('firstName')
  .paginate(page: 5)
  .all()
```

### Associations

``` coffeescript
user  = App.User.first()

# hasMany 'posts'
posts = user.get('posts').where(title: 'First Post').first()
post  = user.get('posts').build(title: 'A Post!')
post  = user.get('posts').create(title: 'A Saved Post!')
posts = user.get('posts').all()

post  = App.Post.first()

# belongsTo 'author'
user  = post.get('author')
```

### Validations

``` coffeescript
user = App.User.build()
user.save()         #=> false
user.get('errors')  #=> {"email": ["Email must be present"]}
user.set('email', 'me@gmail.com')
user.save()         #=> true
user.get('errors')  #=> {}
```

## Routes

``` coffeescript
# config/routes.coffee
App.routes ->
  @match '/login', 'sessions#new', via: 'get', as: 'login'
  @match '/logout', 'sessions#destroy', via: 'get', as: 'logout'
  
  @resources 'posts', ->
    @resources 'comments'
    
  @namespace 'admin', ->
    @resources 'users'
    @resources 'posts', ->
      @resources 'comments'
      
  @constraints subdomain: /^api$/, ->
    @resources 'posts', ->
      @resources 'comments'
      
  @match '(/*path)', to: 'application#index', via: 'get'
```

## Controllers

``` coffeescript
# app/controllers/server/postsController.coffee
class App.PostsController extends Tower.Controller
  index: ->
    App.Post.all (error, posts) =>
      @render 'index', locals: posts: posts
    
  new: ->
    @post = App.Post.build()
    @render 'new'
    
  create: ->
    @post = App.Post.build(@params.post)
    
    super (success, failure) ->
      @success.html => @render 'posts/edit'
      @success.json => @render text: 'success!'
      @failure.html => @render text: 'Error', status: 404
      @failure.json => @render text: 'Error', status: 404
    
  show: ->
    App.Post.find @params.id, (error, post) =>
      @render 'show'
    
  edit: ->
    App.Post.find @params.id, (error, post) =>
      @render 'edit'
    
  update: ->
    App.Post.find @params.id, (error, post) =>
      post.updateAttributes @params.post, (error) =>
        @redirectTo action: 'show'
    
  destroy: ->
    App.Post.find @params.id, (error, post) =>
      post.destroy (error) =>
        @redirectTo action: 'index'
```

## Views

Views are all Ember.

## Templates

Templates adhere to the [Twitter Bootstrap 2.x](http://twitter.github.com/bootstrap/) markup conventions.

The default templating engine is [CoffeeCup](http://easydoc.org/coffeecup), which is pure CoffeeScript.  It's much more powerful than Jade, and it's just as performant if not more so.  You can set Jade or any other templating engine as the default by setting `Tower.View.engine = "jade"` in `config/application`.  Tower uses [Mint.js](http://github.com/viatropos/mint.js), which is a normalized interface to most of the Node.js templating languages.

## Styles

It's all using Twitter Bootstrap, so check out their docs.  http://twitter.github.com/bootstrap/

Actually, all that's built in!  So for the simple case you don't even need to write anything in your controllers (skinny controllers, fat models).  The default implementation is actually a lot more robust than that, just wanted to show a simple example.

## Databases

``` coffeescript
# app/config/server/databases.coffee
module.exports =
  mongodb:
    development:
      name: 'app-development'
      port: 27017
      host: '127.0.0.1'
    test:
      name: 'app-test'
      port: 27017
      host: '127.0.0.1'
    staging:
      name: 'app-staging'
      port: 27017
      host: '127.0.0.1'
    production:
      name: 'app-production'
      port: 27017
      host: '127.0.0.1'
```

## Mailers

``` coffeescript
class App.Notification extends Tower.Mailer
  # app/views/mailers/welcome.coffee template
  @welcome: (user) ->
    @mail to: user.email, from: 'me@gmail.com'
```

## Internationalization

``` coffeescript
# app/config/shared/locales/en.coffee
module.exports =
  hello: 'world'
  forms:
    titles:
      signup: 'Signup'
  pages:
    titles:
      home: 'Welcome to %{site}'
  posts:
    comments:
      none: 'No comments'
      one: '1 comment'
      other: '%{count} comments'
  messages:
    past:
      none: 'You never had any messages'
      one: 'You had 1 message'
      other: 'You had %{count} messages'
    present:
      one: 'You have 1 message'
    future:
      one: 'You might have 1 message'
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
# app/config/server/assets.coffee
module.exports =
  javascripts:
    vendor: [
      '/vendor/javascripts/jquery.js'
      '/vendor/javascripts/underscore.js'
      '/vendor/javascripts/socket.io'
      '/vendor/javascripts/tower.js'
    ]
    
    lib: [
      '/lib/grid.js'
      '/lib/profiler.js'
    ]
    
    application: [
      '/app/models/shared/post.js'
      '/app/models/shared/comment.js'
    ]
    
  stylesheets:
    vendor: [
      '/vendor/stylesheets/reset.css'
    ]
    application: [
      '/app/assets/stylesheets/application.css'
      '/app/assets/stylesheets/theme.css'
    ]
```

## Structure

Here's the structure of a newly generated app with a `Post` model:

```
.
├── app
│   ├── config
│   │   ├── client
│   │   │   ├── bootstrap.coffee
│   │   │   └── watch.coffee
│   │   ├── server
│   │   │   ├── environments
│   │   │   │   ├── development.coffee
│   │   │   │   ├── production.coffee
│   │   │   │   └── test.coffee
│   │   │   ├── initializers
│   │   │   ├── assets.coffee
│   │   │   ├── bootstrap.coffee
│   │   │   ├── credentials.coffee
│   │   │   ├── databases.coffee
│   │   │   └── session.coffee
│   │   └── shared
│   │       ├── locales
│   │       │   └── en.coffee
│   │       ├── application.coffee
│   │       └── routes.coffee
│   ├── controllers
│   │   ├── client
│   │   │   ├── applicationController.coffee
│   │   │   └── postsController.coffee
│   │   └── server
│   │       ├── applicationController.coffee
│   │       └── postsController.coffee
│   ├── models
│   │   ├── client
│   │   ├── server
│   │   └── shared
│   │       └── post.coffee
│   ├── stylesheets
│   │   ├── client
│   │   │   └── application.styl
│   │   └── server
│   │       └── email.styl
│   ├── templates
│   │   ├── server
│   │   │   └── layout
│   │   │       ├── _meta.coffee
│   │   │       └── application.coffee
│   │   └── shared
│   │       ├── layout
│   │       │   ├── _body.coffee
│   │       │   ├── _flash.coffee
│   │       │   ├── _footer.coffee
│   │       │   ├── _header.coffee
│   │       │   ├── _navigation.coffee
│   │       │   └── _sidebar.coffee
│   │       ├── posts
│   │       │   ├── _flash.coffee
│   │       │   ├── _form.coffee
│   │       │   ├── _item.coffee
│   │       │   ├── _list.coffee
│   │       │   ├── _table.coffee
│   │       │   ├── edit.coffee
│   │       │   ├── index.coffee
│   │       │   ├── new.coffee
│   │       │   └── show.coffee
│   │       └── welcome.coffee
│   └── views
│       └── client
│           ├── layout
│           │   └── application.coffee
│           └── posts
│               ├── form.coffee
│               ├── index.coffee
│               └── show.coffee
├── data
│   └── seeds.coffee
├── lib
├── log
├── public
│   ├── fonts
│   ├── images
│   ├── javascripts
│   ├── stylesheets
│   ├── swfs
│   ├── uploads
│   ├── 404.html
│   ├── 500.html
│   ├── favicon.ico
│   ├── humans.txt
│   └── robots.txt
├── scripts
│   └── tower
├── test
│   ├── cases
│   │   ├── controllers
│   │   │   ├── client
│   │   │   └── server
│   │           └── postsControllerTest.coffee
│   │   ├── features
│   │   │   └── client
│   │   └── models
│   │       ├── client
│   │       ├── server
│   │       └── shared
│   │           └── postTest.coffee
│   ├── factories
│   │   └── postFactory.coffee
│   ├── client.coffee
│   ├── mocha.opts
│   └── server.coffee
├── tmp
├── wiki
│   ├── _sidebar.md
│   └── home.md
├── Cakefile
├── grunt.coffee
├── package.json
├── Procfile
├── README.md
└── server.js
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

## Test

``` bash
npm test
```

Run individual test file:

``` bash
mocha $(find test -name "*persistenceTest.coffee")
```

Run test matching pattern:

``` bash
mocha $(find test -name "*persistenceTest.coffee") -g "string property$"
```

Run tests matching directory and pattern:

``` bash
mocha $(find test -name "*Test.coffee" | egrep "/*view*/")
```

[Run tests *not* matching directory and pattern](http://stackoverflow.com/a/12255734/169992):

``` bash
# run all tests except for client tests
mocha $(find test -name client -prune -o -name '*Test.coffee' -print)
```

## Examples

- [Facebook/Twitter Authentication (Passport)](https://github.com/viatropos/tower-authentication-example)
- [towerjs.org (project site)](https://github.com/viatropos/towerjs.org)

## Contributing to Tower

```
git clone https://github.com/viatropos/tower.git
cd tower
```

### Building Tower

You can build Tower manually with:

```
make
```

Or you can have it recompile the files when you change them:

```
make watch
```

### "Linking" Tower

You can symlink your local tower repo to your global npm node_modules directory, which makes it so you can use it in your apps (so if you make changes to the tower repo, you'll see them in your app). Very useful.

In the tower repo:

```
npm link
```

In a tower app:

```
npm link tower
```

If you want to try installing tower from the remote npm registry, you can just unlink it and run `npm install`:

```
npm unlink tower
npm install tower
```

Using `npm link` makes it very easy to mess with the source.

### Running Tests

In the tower repo, run server tests with:

```
make test-server
```

To run client tests, first compile the test app and start its server:

```
make build-test-client
make start-test-client
```

Then run the tests (uses phantomjs)

```
make test-client
```

If you don't have phantomjs you can install it with:

```
brew install phantomjs
```

## License

(The MIT License)

Copyright &copy; 2012 [Lance Pollard](http://twitter.com/viatropos) &lt;lancejpollard@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
