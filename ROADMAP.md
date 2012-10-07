# Tower.js Roadmap

For 0.5.0, Tower will include the features below.  It's going to be a rolling list.  If you have ideas or features you'd like to see, include them in the section [Potential features](#potential-features) section and we'll move them up if they're in scope.

You are free to contribute any of these features in any order… I'm more of a fan of doing what you want when you want to, as long as it follows some general plan.  I stay motivated and get way more done that way.

> Any features marked with `*` have been started. Anything in a "Requirement" section is important and not yet implemented. The rest - in "Improvements" - are improvements on already working/implemented functionality (these things may be moved until later).

## 0.5.0 - Full Featured Release

**High-level Goals**:

- ~~relatively stabilized folder/file structure~~
- ~~`grunt integration`~~
- *data syncing
- *everything in mongodb has an API for it in the ORM
- *authentication and authorization
- *file uploading
- *client routes
- *background jobs in redis
- *mailer
- *testing patterns for an app
- awesome generators like rails_wizard
- useful default theme
- javascript and coffeescript versions
- error pages
- basic ember view patterns established (for tables, forms, and menus)

<a name="0.4.0" href="0.4.0"></a>

### ✔ 0.4.0 (functional release)

- ~~Extend helper method urlFor so that can it resolve to registered paths (aliases) for routes~~
  - ~~`urlFor route: 'signIn'`~~
- ~~hasMany through associations (`Post.hasMany "comments"; Post.hasMany "commenters", through: "comments"`)~~
- ~~database seeds~~
- ~~test model pagination~~
- ~~auto-restart server when file changes (development)~~

<a name="0.4.1" href="0.4.1"></a>

### ✔ 0.4.1 (tests)

- ~~generate `test/models` with example code for scaffold~~
- ~~generators for tests~~
- ~~load tests in browser~~
- ~~make "database cleaner"~~
- ~~test setup for http requests (controllers)~~
- ~~test the command-line api~~
- ~~basic client test setup for tower development~~
- ~~extends hook for coffeescript~~
- ~~test "factories"~~
- ~~basic tests for socket.io~~
- ~~generate `test/controllers` with example code for scaffold~~
- ~~NODE_ENV=production~~
- ~~ember.js integration~~
- ~~integrate Ember.StateMachine into client side routes (https://gist.github.com/2679013)~~
- ~~write `render` for client that handles creating ember views~~
- ~~add `cid` or equaivalent (client id)~~

<a name="0.4.2" href="0.4.2"></a>

### ✔ 0.4.2 (folders)

- ~~rename flattened namespaces (e.g. change `Tower.ModelCursor` to `Tower.Cursor`, which was originally `Tower.Model.Cursor`)~~
- ~~standardize file structure for apps~~
- ~~client-side test setup (with phantomjs)~~
- ~~standardize folder structure for app tests~~
- ~~finalize tower.js internal code organization~~

<a name="0.4.3" href="0.4.3"></a>

### 0.4.3 (installation, platform support)

- ~~get tower src development installation working on mac~~
- ~~get tower src development installation working on linux~~
- ~~get deployment working on windows azure~~
- get npm installation working on windows 7
- make sure `tower console -s` works on windows
- get tower src development installation working on windows
- get working on ie8+
- get coffeescript working w uglifyjs

<a name="0.4.4" href="0.4.4"></a>

### 0.4.4 (controllers)

#### Requirements

- error hooks for controllers
- https helper methods
- compile assets for s3 so you don't have to include them in your repo
- request timeout if app crash

#### Improvements

- *some sort of `updateAll`|`deleteAll` ​functionality for controllers (array of ids)*
- *rails like flash messages
- finish resourceful routes
- finalize resourceful controller actions (see https://github.com/josevalim/inherited_resources)

**Server**

- ~~update to express 3.0~~
- ~~add api to get remote ip address~~
- add api to get [rough] geo from ip address
- better `redirectTo`
- better `urlFor`
- test subdomains on heroku/nodejitsu
- basic controller logging/subscriptions
- namespaced controllers
- test jsonp
- integrate clusters and make sure it works on heroku
- standardize/finish the `URL` object (should be an ember object with computable properties)
- "api endpoints" documentation
  - http://railscasts.com/episodes/350-rest-api-versioning
- some way to cache routes so it doesn't have to iterate through every route for each request.
- restart server if crashed
  - https://github.com/learnboost/up
  - http://stackoverflow.com/questions/9558360/node-js-reliability-for-large-application

**Client**

- better route2ember map
- better controller scopes
- store params on the client as you change state

<a name="0.4.5" href="0.4.5"></a>

### 0.4.5 (models)

- ~~uniqueness validation (database should not save a record unless specified attributes are globally unique (i.e. username))~~
- ~~email/phone validation (and other common validation helpers)~~
- ~~add includes to associations: `Post.includes("author").where(author: firstName: "=~": "Baldwin").all()`~~
- ~~mongo url handler (https://github.com/viatropos/tower/issues/52#issuecomment-4586648)~~
- ~~model indexes in mongodb~~ (and potentially in memory, i.e. a redis-like plugin for the browser)
- ~~`model#reload`~~
- ~~acceptsNestedAttributes~~
- ~~mass assignment security~~
- ~~remove dependency on mongodb~~
- *mongo embedded documents
- test index creation in mongodb
- test inheritance with type property
- migrations (at least the general class/file structure, so if you add a field to mongodb there's a space for you to write code to update your models with the new values).
- make `metadata` and `fields` (and all class accessor-like methods) use `get` as ember computable properties.
- bindable criteria (params passed to cursors)
- nested field queries ("addresses.city", etc.)
- basic model logging (so you can see things like database queries)
- completely finish (robustness-wise) all different types of query conditions (`find(id: null) # find by null`, `where(name: "!=": "x")`, `find(address: city: "San Diego") # nested doc/object queries`, etc)
- make `store` global, so you only have to apply it once, not per model. makes testing easier.
- i18n (internationalization/localization, how to organize the random labels in the app, and prepare for translation into other languages)
- confirmation validation (password confirmation, agree to terms, etc.)
- think about making scopes use `get()`, so `App.User.get('recent')`. This way they can be used in views.
- a direct database-2-request JSON stream, so you can optimize `index` requests, not having to instantiate models at all.
- perhaps a `App.User.on 'create', (error, record) ->` api for globally hooking into record persistence (pub/sub)
- if no `id` or array of ids are sent to `destroy` on a store (such as mongodb), then send the `cursor.toParams()` to the connected client so they remove those records.
- remove the `Tower.ModelScope` wrapper class.
- the store should be higher level, so a "google maps store" would provide a somewhat REST API to a few resources (place, location, business, etc.) So the store has a set of models/tables/collections it manages.

<a name="0.4.6" href="0.4.6"></a>

### 0.4.6 (templates, views)

- automatic sorting when new model is added to cursor (`Ember.Sortable`)
- automatic form validations based on model of client
- error/stacktrace printing when view fails to fully render
- 404/etc error pages
- error handling on forms when validation error
- finish table builder
- make form builder more robust
- test client side view rendering with ember
- test files reload when changed (integration test)
- test assets can be served with gzip
- masking input fields (phone numbers, social security, email, money, etc.)

By this point, the models, views, templates, and controllers should be fairly complete.

<a name="0.4.7" href="0.4.7"></a>

### 0.4.7 (model extensions)

- *authentication
- *authorization ([tower-model/shared/ability.coffee](https://github.com/viatropos/tower/blob/a6acf7ecfd5f7ed5d501fdd0c2adc2f0b828c1c6/packages/tower-model/shared/ability.coffee))
- *test storing images on s3 ([tower-store/server/s3.coffee](https://github.com/viatropos/tower/blob/a6acf7ecfd5f7ed5d501fdd0c2adc2f0b828c1c6/packages/tower-store/server/s3.coffee))
- *image/asset/attachment model api (see https://github.com/thoughtbot/paperclip) ([tower-model/shared/attachment.coffee](https://github.com/viatropos/tower/blob/a6acf7ecfd5f7ed5d501fdd0c2adc2f0b828c1c6/packages/tower-model/shared/attachment.coffee))

<a name="0.4.8" href="0.4.8"></a>

### 0.4.8 (sockets)

- ~~push notifications (web socket integration into the controllers)~~
- ~~swappable sockets api (sock.ly, socket.io)~~
- ~~subscribe/notifications~~
- *document the cursor/pub-sub api
- write lots of tests for this

<a name="0.4.9" href="0.4.9"></a>

### 0.4.9 (background jobs, emails)

- ~~Test the mailer on heroku~~
- ~~background queuing with redis (`User.queue("welcome", 1)` vs. `User.welcome(1)`, for background processing) - https://github.com/technoweenie/coffee-resque~~
- test running background jobs on heroku and nodejitsu
- inline css in email templates
- make logs write to `./log` folder.

<a name="0.4.10" href="0.4.10"></a>

### 0.4.10 (helpers, configuration)

- add underscore helpers
  - *geo transforms (lat/lng to x/y in pixels, etc.)
  - *date helpers
  - *string helpers
  - *validators
  - pixel transforms (px to em to percent to rem)
  - color transforms (hsl to rgb to hex, etc.)
  - unit transforms (miles to km, etc.)
  - number helpers
- customize template engine, orm, and test framework in App.config
- switch to parsing url params with URI.js
- http caching methods in the controller
- redirect helpers at the top level, so you easily write permanent redirects (http://stackoverflow.com/questions/4046960/how-to-redirect-without-www-using-rails-3-rack)
- create normalized file/directory api (wrench, pathfinder, findit... need to merge this stuff into one)
- cloud paas environment variable map
- handle app config:
  ``` ruby
  config.encoding = "utf-8"
  config.filter_parameters += [:password, :password_confirmation]
  config.time_zone = "Pacific Time (US & Canada)"
  ```
- use require in the browser to lazy load scripts
- gruntjs
- term-css
- https://github.com/kuno/GeoIP
- global timestamps/userstamps config boolean, to DRY model `@timestamps()` if desired
- http://jsperf.com/angular-vs-knockout-vs-ember/2
- have a built in list of every city/state/country/etc (some "standard" set). for select boxes and geolocation.
- google maps/places api integration, and foursquare api integration (generic geo api wrapper)
- awesome demo/faker data system that will allow you do cool things like: 1) generate models over a time interval, where they follow some statistical distribution (I did this using http://rb-gsl.rubyforge.org/files/rdoc/screenshot_rdoc.html in rails to create users who bought deals to create a semi-realistic demo dashboard back in the day), 2) tailor demo urls/usernames to something like your facebook friends or links you've posted in your twitter feed for example, etc.
- pretty-print helpers for tables/records in the terminal
  - you could even potentially edit the data in the terminal using ascii escape codes! That would be cool.
  - http://www.gnu.org/software/oleo/doc/oleo.html
  - http://www.linuxjournal.com/article/10699
  - https://github.com/sferik/t

<a name="0.5.0" href="0.5.0"></a>

### 0.5.0 (theme)

- well designed error/stacktrace page
- basic responsive admin theme, with functionality like http://activeadmin.info/
- client and server have the same interface, separate code out so client is as lean as possible
- make sure templates have proper escaping (xss protection)
- http://rails-admin-tb.herokuapp.com/admin/league

<a name="0.6.0" href="0.6.0"></a>

## 0.6.0 - Testing, Robustness

<a name="0.5.1" href="0.5.1"></a>

### 0.5.1 (benchmarking)

- cache manifest: https://github.com/johntopley/manifesto
- integrate `"use strict";` into the codebase if possible
- benchmarks folder with stress tests

<a name="0.5.2" href="0.5.2"></a>

### 0.5.2 (cleanup, optimizations, documentation)

- autocomplete in the terminal (rubymine, node-inspector)
- ~~autoreload in the console (using hook.io)~~
- *chunk code into parts for the client, so you can use only bare minimum if desired (so you can do things like `require('tower-model')`)
- deleting/creating files isn't registering anymore, fix.
- document code.
- standardize `Tower.x` api for global helper methods.

<a name="0.7.0" href="0.7.0"></a>

## 0.7.0 - Performance Tuning

<a name="0.8.0" href="0.8.0"></a>

## 0.8.0 - Multiple Databases, Batch Requests, Content Processing

- postgresql
- mysql
- sqlite
- cassandra
- redis
- neo4j
- database migrations
- transaction support
- batch requests
- video/audio/image processing

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

## Other

- compile all test/cases into tests.js to render on towerjs.org
- for tower development, compile and load client sub-packages to improve workflow.
- better error reporting w/ coffeescript (`options = bare: true, filename: filePath`)
- need to figure out how to append fields to a model base class after the other models have been subclassed.
- convert modules to `Ember.Mixin` objects. 
- convert all `class X` in tower to `.extend`, just javascript
- generic file/path extensions
  - file.matches
  - file.pattern()

### Nice-to-haves

- port most/all rails tests
- add extension generator
- add library generator
- get progress bar feedback for streaming file uploads
  - http://debuggable.com/posts/streaming-file-uploads-with-node-js:4ac094b2-b6c8-4a7f-bd07-28accbdd56cb
- Add generator for translating different locales in tower.

### TowerPassport

- authentication extension (so it's easy to start using authentication, potentially with passport
- tower generate authentication Session
- see [devise](https://github.com/plataformatec/devise) for inspiration, but I'm not a fan of devise b/c it's way too hard to customize and creates too much abstraction.  But the feature set it includes is great.  https://github.com/plataformatec/devise/wiki/OmniAuth:-Overview

### Tower.Authorization (Tower.Ability)

- authorization extension (https://github.com/ryanb/cancan)

### Tower.Attachment

- paperclip?

### NestedSet

- https://github.com/collectiveidea/awesome_nested_set for hierarchical relationships

### Tower.Titanium

It's going to be very easy now to make Tower work with titanium mobile.  With coffeekup, you can have the form builder compile down to titanium objects no problem, something like:

``` coffeescript
App.View.helpers
  tabs: (options = {}) ->
    Titanium.UI.createTabGroup(options)
    
  tab: (options) ->
    options.window ||= @currentPane
    Titanium.UI.createTab(options)
    
  pane: (options, callback) ->
    @currentPane  = Titanium.UI.createWindow(options)
    callback()
```

``` coffeescript
tabs ->
  tab id: 'posts-tab', title: "Feed", ->
    pane title: "My Blog", ->
      table id: 'posts-table', data: App.Post.all()
```

### Other plugins

- Make a mocha web console reporter.
- User stamping
- Versioning
- Advanced (lucene) search (down the road)

## Alternative data stores

These are next, larger features.  These will be included in earlier releases if a member of the community contributes them.  Otherwise they might be approached after the 0.5.0 release according to community requests.

- Neo4j support
- CouchDB support
- PostGreSQL support
- MySQL support
- SQLite3 support
- LocalStorage support
- Redis support

<a name="potential-features" href="potential-features"></a>

## Potential Features

- ~~state machine (see [https://github.com/pluginaweek/stateMachine](https://github.com/pluginaweek/stateMachine))~~ Ember.js has this built in!
- hierarchical models (nested sets)
- need to think about having a separate library like https://github.com/flamejs/flame.js that handles common components.  Definitely tower should work without this, but these components may be useful.
- ~~fork node.js process to speed up app booting (not possible, can't do this, looked into)~~

## Helpful Libraries

- https://github.com/isaacs/rimraf (removing files cross platform)
- https://github.com/paulmillr/chokidar

## Unsolved Complexities

- Handling transactions from the client. How would you save the data for credit/account (subtract one record, add to another) so if one fails both revert back (if you try to keep it simplified and only POST individual records at a time)? You can do embedded models on MongoDB, and transactions on MySQL perhaps. Then if `acceptsNestedAttributesFor` is specified it will send nested data in JSON POST rather than separate. Obviously it's better to not do this on the server, but we should see if it's possible to do otherwise, and if not, publicize why.

## Decisions (need to finalize)

- for uniqueness validation, if it fails on the client, should it try fetching the record from the server? (and loading the record into the client memory store). Reasons for include having to do less work as a coder (lazy loads data). Reasons against include making HTTP requests to the server without necessarily expecting to - or you may not want it to fetch. Perhaps you can specify an option (`lazy: true`) or something, and on the client if true it will make the request (or `autofetch: true`)
- For non-transactional (yet still complex) associations, such as `group hasMany users through memberships`, you can save one record at a time, so the client should be instant. But if the first record created fails (say you do `group.members.create()`, which creates a user, then a membership tying the two together), what should the client tell the user? Some suggest a global notification (perhaps an alert bar) saying a more generic message such as "please refresh the page, some data is out of sync". But if the data is very important, ideally the code would know how to take the user (who might click this notification) to a form to try saving the `hasMany through` association again. If it continues to fail, it's probably either a bug in the code, or we should be able to know if the server is having issues (like it's crashed or power went out) - then if it's a bug we can have them notify us (some button perhaps) or if it's a real server problem we prepared for we can notify something like "sorry, having server issues, try again later". Other that that, it's up to you to build the validations properly so the data is saved

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

## Other Random Things

- jsparse
- https://github.com/jondot/graphene
- https://github.com/rwldrn/jquery-hive