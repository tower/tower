# Tower.js Roadmap

For 0.5.0, Tower will include the features below.  It's going to be a rolling list.  If you have ideas or features you'd like to see, include them in the section [Potential features](#potential-features) section and we'll move them up if they're in scope.

You are free to contribute any of these features in any order… I'm more of a fan of doing what you want when you want to, as long as it follows some general plan.  I stay motivated and get way more done that way.

> Any features marked with `*` have been started.

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

Since this point, tower has a fairly robust development/build workflow to make it as simple as possible to contribute.

<a name="0.4.3" href="0.4.3"></a>

### 0.4.3 (controllers)

- *some sort of `updateAll`|`deleteAll` ​functionality for controllers (array of ids)*
- *rails like flash messages
- error hooks for controllers
- better route2ember map
- finish resourceful routes
- finalize resourceful controller actions (see https://github.com/josevalim/inherited_resources)
- better `redirectTo`
- better `urlFor`
- test subdomains on heroku/nodejitsu
- basic controller logging/subscriptions
- https helper methods
- namespaced controllers
- update to express 3.0
- test jsonp
- store params on the client as you change state

Other random things:

- compile all test/cases into tests.js to render on towerjs.org
- need to figure out how to append fields to a model base class after the other models have been subclassed.
- convert modules to `Ember.Mixin` objects. 
- convert all `class X` in tower to `.extend`, just javascript

<a name="0.4.4" href="0.4.4"></a>

### 0.4.4 (templates, views)

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

By this point, the models, views, templates, and controllers should be fairly complete.

<a name="0.4.6" href="0.4.6"></a>

### 0.4.6 (model extensions)

- *authentication
- *authorization ([tower-model/shared/ability.coffee](https://github.com/viatropos/tower/blob/a6acf7ecfd5f7ed5d501fdd0c2adc2f0b828c1c6/packages/tower-model/shared/ability.coffee))
- *test storing images on s3 ([tower-store/server/s3.coffee](https://github.com/viatropos/tower/blob/a6acf7ecfd5f7ed5d501fdd0c2adc2f0b828c1c6/packages/tower-store/server/s3.coffee))
- *image/asset/attachment model api (see https://github.com/thoughtbot/paperclip) ([tower-model/shared/attachment.coffee](https://github.com/viatropos/tower/blob/a6acf7ecfd5f7ed5d501fdd0c2adc2f0b828c1c6/packages/tower-model/shared/attachment.coffee))

<a name="0.4.7" href="0.4.7"></a>

### 0.4.7 (sockets)

- ~~push notifications (web socket integration into the controllers)~~
- ~~swappable sockets api (sock.ly, socket.io)~~
- ~~subscribe/notifications~~
- *document the cursor/pub-sub api
- write lots of tests for this

<a name="0.4.8" href="0.4.8"></a>

### 0.4.8 (background jobs, emails)

- ~~Test the mailer on heroku~~
- ~~background queuing with redis (`User.queue("welcome", 1)` vs. `User.welcome(1)`, for background processing) - https://github.com/technoweenie/coffee-resque~~
- test running background jobs on heroku and nodejitsu
- inline css in email templates
- make logs write to `./log` folder.

<a name="0.4.9" href="0.4.9"></a>

### 0.4.9 (helpers, configuration)

- add underscore helpers
  - *geo transforms (lat/lng to x/y in pixels, etc.)
  - *date helpers
  - *string helpers
  - *validators
  - pixel transforms (px to em to percent to rem)
  - color transforms (hsl to rgb to hex, etc.)
  - unit transforms (miles to km, etc.)
  - number helpers
  - masking input fields (phone numbers, social security, email, money, etc.)
- customize template engine, orm, and test framework in App.config
- switch to parsing url params with URI.js
- http caching methods in the controller
- redirect helpers at the top level, so you easily write permanent redirects (http://stackoverflow.com/questions/4046960/how-to-redirect-without-www-using-rails-3-rack)
- create normalized file/directory api (wrench, pathfinder, findit... need to merge this stuff into one)
- handle app config:
  ``` ruby
  config.encoding = "utf-8"
  config.filter_parameters += [:password, :password_confirmation]
  config.time_zone = "Pacific Time (US & Canada)"
  ```

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

## Other

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