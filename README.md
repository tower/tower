# Coach.js

> Full Stack Web Framework for Node.js.  Minified & Gzipped: 15.7kb

## Install

``` bash
npm install coach -d
```

## Generator

``` bash
coach new my-app
```

## Structure

``` bash
.
|-- app
|   |-- controllers
|   |   |-- admin
|   |   |   |-- postsController.coffee
|   |   |   `-- usersController.coffee
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
class App extends Coach.Application
  @config.encoding = "utf-8"
  @config.filterParameters += ["password", "password_confirmation"]
  @config.loadPaths += ["./themes"]
```

## Models

``` coffeescript
class App.User extends Coach.Model
  @key "firstName"
  @key "createdAt", type: "Date", default: -> new Date()
  @key "coordinates", type: "Geo"
  
  @scope "byBaldwin", firstName: "=~": "Baldwin"
  @scope "thisWeek", @where createdAt: ">=": -> require('moment')().subtract('days', 7)
  
  @hasMany "posts", className: "App.Post", cache: true # postIds
  
  @validate "firstName", presence: true
  
class App.Post extends Coach.Model
  @belongsTo "author", className: "App.User"
  
User.where(createdAt: ">=": _(2).days().ago(), "<=": new Date()).within(radius: 2).desc("createdAt").asc("firstName").paginate(page: 5).all (error, records) =>
  @render json: User.toJSON(records)

# should handle these but doesn't yet.  
Post.includes("author").where(author: firstName: "=~": "Baldwin").all()
Post.includes("author").where("author.firstName": "=~": "Baldwin").all()
# userIds = User.where(firstName: "=~": "Baldwin").select("id")
# Post.where(authorId: $in: userIds).all()

User.includes("posts").where("posts.title": "Welcome").all()
```

## Routes

``` coffeescript
# config/routes.coffee
Coach.Route.draw ->
  @match "/login",         "sessions#new", via: "get", as: "login"
  
  @resources "posts", ->
    @resources "comments"
```

Routes are really just models, `Coach.Route`.  You can add and remove and search them however you like:

``` coffeescript
Coach.Route.where(pattern: "=~": "/posts").first()
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
    link rel: 'stylesheet', href: '/stylesheets/application.css'
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

The default templating engine is [CoffeeKup](http://coffeekup.org/), which is pure coffeescript.  It's much more powerful than Jade, and it's just as performant if not more so.  You can set Jade or any other templating engine as the default by setting `Coach.View.engine = "jade"` in `config/application`.  Coach uses [Shift.js](http://github.com/viatropos/shift.js), which is a normalized interface to most of the Node.js templating languages.

## Controllers

``` coffeescript
class PostsController extends Coach.Controller
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

## Helpers

Since all of the controller/routing code is available on the client, you can go directly through that system just like you would the server.

``` coffeescript
# Just request the url, and let it do it's thing
Coach.get '/posts'

# Same thing, this time passing parameters
Coach.get '/posts', createdAt: "2011-10-26..2011-10-31"

# Dynamic
Coach.urlFor(Post.first()) #=> "/posts/the-id"
Coach.navigate Coach.urlFor(post)
```

Those methods pass through the router and client-side middleware so you have access to `request` and `response` objects like you would on the server.

## Middleware

It's built on [connect](http://github.com/sencha/connect), so you can use any of the middleware libs out there.

## Test, Develop, Minify

``` bash
cake coffee
cake spec
cake minify
```

## License

(The MIT License)

Copyright &copy; 2011 - 2012 [Lance Pollard](http://twitter.com/viatropos) &lt;lancejpollard@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


### More

```
Coach.Support.String.parameterize = (string) ->
  Coach.Support.String.underscore(string).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "-").replace(/^-+|-+$/g, '')

Coach.Model.toParam = ->
  Coach.Support.String.underscore(Coach.Support.String.pluralize(@name)).replace("_", "-")
  
Coach.Model::toParam = ->
  @id.toString()
  
Coach.Route.find = (options) ->
  routes  = @all()
  for route in routes
    success = true
    for key, value of options
      console.log route
      success = route.controller[key] == value
      break unless success
    return route if success
  null

# use single quotes, otherwise they're escaped
Coach.Support.String.toQueryValue = (value, negate = "") ->
  if Coach.Support.Object.isArray(value)
    items = []
    for item in value
      result  = negate
      result += item
      items.push result
    result = items.join(",")
  else
    result    = negate
    result   += value.toString()
  
  result = result.replace(" ", "+").replace /[#%\"\|<>]/g, (_) -> encodeURIComponent(_)
  result

# toQuery likes: 10
# toQuery likes: ">=": 10
# toQuery likes: ">=": 10, "<=": 20
# toQuery tags: ["ruby", "javascript"]
# toQuery tags: "!=": ["java", ".net"]
#   #=> tags=-java,-ruby
# toQuery tags: "!=": ["java", ".net"], "==": ["ruby", "javascript"]
#   #=> tags=ruby,javascript,-java,-ruby
Coach.Support.String.toQuery = (object, schema = {}) ->
  result = []
  
  for key, value of object
    param   = "#{key}="
    type    = schema[key] || "string"
    negate  = if type == "string" then "-" else "^"
    
    if Coach.Support.Object.isHash(value)
      data          = {}
      data.min      = value[">="] if value.hasOwnProperty(">=")
      data.min      = value[">"]  if value.hasOwnProperty(">")
      data.max      = value["<="] if value.hasOwnProperty("<=")
      data.max      = value["<"]  if value.hasOwnProperty("<")
      data.match    = value["=~"] if value.hasOwnProperty("=~")
      data.notMatch = value["!~"] if value.hasOwnProperty("!~")
      data.eq       = value["=="] if value.hasOwnProperty("==")
      data.neq      = value["!="] if value.hasOwnProperty("!=")
      data.range    = data.hasOwnProperty("min") || data.hasOwnProperty("max")
      
      set = []
  
      if data.range && !(data.hasOwnProperty("eq") || data.hasOwnProperty("match"))
        range = ""
        
        if data.hasOwnProperty("min")
          range += Coach.Support.String.toQueryValue(data.min)
        else
          range += "n"
        
        range += ".."
        
        if data.hasOwnProperty("max")
          range += Coach.Support.String.toQueryValue(data.max)
        else
          range += "n"
        
        set.push range
      
      if data.hasOwnProperty("eq")
        set.push Coach.Support.String.toQueryValue(data.eq)
      if data.hasOwnProperty("match")
        set.push Coach.Support.String.toQueryValue(data.match)
      if data.hasOwnProperty("neq")
        set.push Coach.Support.String.toQueryValue(data.neq, negate)
      if data.hasOwnProperty("notMatch")
        set.push Coach.Support.String.toQueryValue(data.notMatch, negate)
      
      param += set.join(",")
    else
      param += Coach.Support.String.toQueryValue(value)
    
    result.push param
  
  result.sort().join("&")
  
Coach.Support.String.extractDomain = (host, tldLength = 1) ->
  return null unless @namedHost(host)
  parts = host.split('.')
  parts[0..parts.length - 1 - 1 + tldLength].join(".")

Coach.Support.String.extractSubdomains = (host, tldLength = 1) ->
  return [] unless @namedHost(host)
  parts = host.split('.')
  parts[0..-(tldLength+2)]
  
Coach.Support.String.extractSubdomain = (host, tldLength = 1) ->
  @extractSubdomains(host, tldLength).join('.')

Coach.Support.String.namedHost = (host) ->
  !!!(host == null || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.exec(host))
  
Coach.Support.String.rewriteAuthentication = (options) ->
  if options.user && options.password
    "#{encodeURI(options.user)}:#{encodeURI(options.password)}@"
  else
    ""

Coach.Support.String.hostOrSubdomainAndDomain = (options) ->
  return options.host if options.subdomain == null && options.domain == null
  
  tldLength = options.tldLength || 1
  
  host = ""
  unless options.subdomain == false
    subdomain = options.subdomain || @extractSubdomain(options.host, tldLength)
    host += "#{subdomain}." if subdomain
    
  host += (options.domain || @extractDomain(options.host, tldLength))
  host

# urlFor controller: "posts", action: "index"
# urlFor @user
# urlFor User
# urlFor "admin", @user
# Coach._urlFor({onlyPath: true, params: {likes: {">=": -10, "<=": 20, "!=": [13, 15]}, tags: {"==": ["ruby", /javascript /i], "!=": ["java"]}}, trailingSlash: false}, {likes: "integer"})
# "?likes=-10..20,^13,^15&tags=ruby,/javascript+/i,-java"
Coach.Support.String.urlFor = (options) ->
  unless options.host || options.onlyPath
    throw new Error('Missing host to link to! Please provide the :host parameter, set defaultUrlOptions[:host], or set :onlyPath to true')

  result  = ""  
  params  = options.params || {}
  path    = (options.path || "").replace(/\/+/, "/")
  schema  = options.schema || {}
  
  delete options.path
  delete options.schema
  
  unless options.onlyPath
    port  = options.port
    delete options.port
    
    unless options.protocol == false
      result += options.protocol || "http"
      result += ":" unless result.match(Coach.Support.RegExp.regexpEscape(":|//"))
    
    result += "//" unless result.match("//")
    result += @rewriteAuthentication(options)
    result += @hostOrSubdomainAndDomain(options)
    
    result += ":#{port}" if port
    
  # params.reject! {|k,v| v.toParam.nil? }
  
  if options.trailingSlash
    result += path.replace /\/$/, "/"
  else
    result += path
    
  result += "?#{Coach.Support.String.toQuery(params, schema)}" unless Coach.Support.Object.isBlank(params)
  result += "##{Coach.Support.String.toQuery(options.anchor)}" if options.anchor
  result

# Coach.urlFor(RW.MongoUser.first(), {onlyPath: false, params: {likes: {">=": -10, "<=": 20, "!=": [13, 15]}, tags: {"==": ["ruby", /javascript#/i], "!=": ["java"]}}, trailingSlash: true, host: "rituwall.com", user: "lance", password: "pollard", anchor: {likes: 10}})
# "http://lance:pollard@rituwall.com/mongo-users/1?likes=-10..20,-13,-15&tags=ruby,/javascript%23/i,-java#likes=10"
Coach.urlFor = ->
  args = Coach.Support.Array.args(arguments)
  return null unless args[0]
  if args[0] instanceof Coach.Model || (typeof(args[0])).match(/(string|function)/)
    last = args[args.length - 1]
    if last instanceof Coach.Model || (typeof(last)).match(/(string|function)/)
      options = {}
    else
      options = args.pop()
      
  options ||= args.pop()
  
  result    = ""
  
  if options.controller && options.action
    route   = Coach.Route.find(name: options.controller.replace(/(Controller)?$/, "Controller"), action: options.action)
    if route
      result  = "/" + Coach.Support.String.parameterize(options.controller)
  else
    for item in args
      result += "/"
      if typeof(item) == "string"
        result += item
      else if item instanceof Coach.Model
        result += item.constructor.toParam() + "/" + item.toParam()
      else if typeof(item) == "function"
        result += item.toParam()
  
  result += switch options.action
    when "new" then "/new"
    when "edit" then "/edit"
    else
      ""
  
  options.path = result
  
  Coach.Support.String.urlFor(options)
  
Coach.get = ->
  url = Coach.urlFor(arguments...)

Coach.Route.draw ->
  

```