# Tower.js <img src="http://i.imgur.com/e3VLW.png"/>

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

## Contributor Note

All of the base ideas are now pretty much in the Tower codebase, now it's just a matter of fleshing out the edge cases and a few implementations. Here's what's new:

- Background jobs in Redis. The `Model.enqueue` and `Model#enqueue` methods are convention for off-loading expensive tasks to the background. You then run `cake work` and it will start the [kue](https://github.com/LearnBoost/kue) background worker to process items in the different redis queues. That process is running in a totally separate environment, but they can communicate b/c of redis' nice pub/sub api. This still needs to be fleshed out and tested a bit more but the basics are there.
- Attachments. File uploading is working, as well as image resizing with imagemagick. I've started working on post-processing using background redis jobs as well. Tower should have a standard set of attachment "processors" to make uploading/processing attachments dead-simple (it's still pretty hard in Rails). This includes from any format to standard formats (video/audio/docs/images/etc.), video/audio/image processing/compression, text extraction and resizing, and document processing (pdf text extraction, MS Word to text, etc.). It's all pretty straight forward, just need to wrap command-line tools. See http://documentcloud.github.com/docsplit/.
- Authentication. I don't think I've merged the authentication code yet, but an older version is here: https://github.com/viatropos/tower-authentication-example. The whole logging in with email/facebook/etc. should be completely solved. Right now mongodb session support is working locally, I will merge it when I finish with some other stuff.
- Subdomains. Subdomains should be first-class citizens. We need to thoroughly test them in production. JSONP support exists (to do `GET` requests across domains), need to test that out. Need to get a better/leaner URL parser, but what's in there now works. Need to test authentication/sessions/cookies across subdomains.
- Authorization. I've started on the authorization system (inspired from [cancan](https://github.com/ryanb/cancan/)). It works and is pretty awesome :). Just need to add some controller hooks to make it plug-and-chug.
- Mass-assignment protection. I've implemented the basics of "mass assignment protection" (see the [Rails Security Guide](http://guides.rubyonrails.org/security.html#mass-assignment)), need to test it out a bit more. Also need to handle input sanitization.
- Embedded Documents. I've mapped out how this could be implemented but it's still on the todo list.
- Associations (hasMany, hasManyThrough, belongsTo, hasOne). They all work well (tested manually on the client as well, pretty awesome seeing hasManyThrough relations save on the client). There's a good amount of work to be done on making sure `user.address == address.user`, that kind of reflection stuff (especially for binding on the view). Wrote down a lot of ideas on how to implement an "identity map", but we have to be careful about garbage collection if we're going to store references to the request/controller objects in some hidden "thread" (see some of the recent commits for notes - early/mid July). Also need to make the validations/callbacks more robust for `acceptsNestedAttributesFor`, but it's all working at a basic level.
- The Cursor. The cursor is _super_ awesome :). There's a ton more ideas on how to make it even more awesome, but for now it does what it's supposed to. I'd like to simplify the notification system eventually (telling the client of model changes).
- User stamping. This should be a fundamental part of the model layer (similar to time stamping). The base mixin has been started but isn't ready yet - it requires setting up the identity-map/thread idea so you can pass around the `currentUser` transparently between cursors/models in the context of a single request.
- Versioning. Versioning is a tricky concept to implement, and it is not required for all apps. But it is generic enough and useful enough that it is going to be included in Tower (eventually as a separate sub-package). It allows you to keep a history of model changes (and alongside userstamping, who made those changes). I have started this as well.
- Soft deleting models. Sometimes you want to allow users to "delete" their data, but you don't _really_ want it deleted from the database. To do this you just add a `deletedAt` field to your model, and then make it so all queries by default ignore models without `deletedAt == null`. You want this kind of stuff to do things like "restore your deleted account", or just know what's happened historically in your app (as a startup for example).
- Ember Views. This is the next big thing to do, but it's really independent of Tower. Tower can create some helpers like form builders and whatnot, but that might take a long time - particularly b/c there's going to be a lot of work put in to make sure performance is top-notch with all those views.
- Client Routes. The base code for mapping routes.coffee into the Ember routing system is there, but the Ember API is changing weekly almost so I haven't gotten back to it. It should only take a few hours to wire up.

If you're excited to work on one of these things let me know and I'll point you to where things are and all that. Once all of this stuff is reasonably complete (mid August hopefully), this will merge into master. From there it's going to be "robustifying" everything, and hardcore performance tuning.

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

If you would like to mess around with the tower source code, clone it and start the grunt watcher to compile all of the coffeescripts:

```
make watch
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

For developing, you may also want to link tower and tower-tasks globally so you can reuse it between multiple projects:

```
cd <tower repo>
npm link
cd lib/tower-tasks
npm link
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

## Structure

Here's how you might organize a blog:

```
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
|       |-- development.coffee
|       |-- production.coffee
|       `-- test.coffee
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
global.App = Tower.Application.create()
```

## Models

``` coffeescript
# app/models/user.coffee
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
# app/models/post.coffee
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
# app/models/comment.coffee
class App.Comment extends Tower.Model
  @field 'message'
  
  @belongsTo 'author', type: 'User'
  @belongsTo 'commentable', polymorphic: true
```
``` coffeescript
# app/models/address.coffee
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

## Views

Views adhere to the [Twitter Bootstrap 2.x](http://twitter.github.com/bootstrap/) markup conventions.

The default templating engine is [CoffeeCup](http://easydoc.org/coffeecup), which is pure CoffeeScript.  It's much more powerful than Jade, and it's just as performant if not more so.  You can set Jade or any other templating engine as the default by setting `Tower.View.engine = "jade"` in `config/application`.  Tower uses [Mint.js](http://github.com/viatropos/mint.js), which is a normalized interface to most of the Node.js templating languages.

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
    @post = App.Post.build()
    @render "new"
    
  create: ->
    @post = App.Post.build(@params.post)
    
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

## Examples

- [towerjs.org (project site)](https://github.com/viatropos/towerjs.org)

## License

(The MIT License)

Copyright &copy; 2012 [Lance Pollard](http://twitter.com/viatropos) &lt;lancejpollard@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Unsolved Complexities

- Handling transactions from the client. How would you save the data for credit/account (subtract one record, add to another) so if one fails both revert back (if you try to keep it simplified and only POST individual records at a time)? You can do embedded models on MongoDB, and transactions on MySQL perhaps. Then if `acceptsNestedAttributesFor` is specified it will send nested data in JSON POST rather than separate. Obviously it's better to not do this on the server, but we should see if it's possible to do otherwise, and if not, publicize why.

## Decisions (need to finalize)

- for uniqueness validation, if it fails on the client, should it try fetching the record from the server? (and loading the record into the client memory store). Reasons for include having to do less work as a coder (lazy loads data). Reasons against include making HTTP requests to the server without necessarily expecting to - or you may not want it to fetch. Perhaps you can specify an option (`lazy: true`) or something, and on the client if true it will make the request (or `autofetch: true`)
- For non-transactional (yet still complex) associations, such as `group hasMany users through memberships`, you can save one record at a time, so the client should be instant. But if the first record created fails (say you do `group.members.create()`, which creates a user, then a membership tying the two together), what should the client tell the user? Some suggest a global notification (perhaps an alert bar) saying a more generic message such as "please refresh the page, some data is out of sync". But if the data is very important, ideally the code would know how to take the user (who might click this notification) to a form to try saving the `hasMany through` association again. If it continues to fail, it's probably either a bug in the code, or we should be able to know if the server is having issues (like it's crashed or power went out) - then if it's a bug we can have them notify us (some button perhaps) or if it's a real server problem we prepared for we can notify something like "sorry, having server issues, try again later". Other that that, it's up to you to build the validations properly so the data is saved

## Todo

- use require in the browser to lazy load scripts
- gruntjs
- term-css
- https://github.com/kuno/GeoIP
- global timestamps/userstamps config boolean, to DRY model `@timestamps()` if desired
- make tower into subpackages: (model/client, model/server, model/shared, controller/client, etc...)
- http://jsperf.com/angular-vs-knockout-vs-ember/2

## New Stuff (api is todo, can access now through Tower.router)

``` coffeescript
@resources 'posts'
@namespace 'admin', ->
  @resources 'posts'
```

``` coffeescript
Tower.urlFor(App.Post)
Tower.urlFor('root.posts.index')
```

``` coffeescript
# GET
App.indexPosts(title: 'A') # App.action, Tower.action, which one?
App.showPost(id: 1)
App.newPost()
App.editPost(id: 1)
# Non-GET
App.createPost()
App.updatePost(id: 1)
App.destroyPost(id: 1)
```

``` html
{{#each post in App.postsController.all}}
<a {{action editPost post href=true}}>Edit</a>
{{/each}}
```

``` coffeescript
# @todo
App.indexAdminPosts() # /admin/posts
App.indexPostComments(postId: 1) # /posts/1/comments
```

## Changelog

- `brew install tree`, then you can type command `tree` to see project structure (https://github.com/cowboy/grunt-node-example)
- todo: need to test installing different versions of node with https://github.com/creationix/nvm
- https://gist.github.com/1398757

## Contributing to Tower

### Running Tests

Run server tests:

```
make test
```

To run client tests, first start the test server on port `3210`, and then run phantomjs:

```
node test/example -p 3210
```