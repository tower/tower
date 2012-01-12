require '../config'

describe "Tower.Dispatch.Route", ->
  describe "dsl", ->
    beforeEach ->
      Tower.Application.instance().teardown()
      
      Tower.Route.draw ->
        @match "/login",  to: "sessions#new", via: "get", as: "login", defaults: {flow: "signup"}, constraints: {subdomain: /www/}
        
        @match "/users",          to: "users#index", via: "get"
        @match "/users/:id/edit", to: "users#edit", via: "get"
        @match "/users/:id",      to: "users#show", via: "get"
        @match "/users",          to: "users#create", via: "post"
        @match "/users/:id",      to: "users#update", via: "put"
        @match "/users/:id",      to: "users#destroy", via: "delete"
    
    it "should map", ->
      routes  = Tower.Route.all()
      
      # console.log Tower.Route.first(pattern: "=~": "/users/10/edit")
      
      expect(routes.length).toEqual(7)
      
      route   = routes[0]
      
      expect(route.path).toEqual("/login.:format?")
      expect(route.controller.name).toEqual("sessionsController")
      expect(route.controller.className).toEqual("SessionsController")
      expect(route.controller.action).toEqual("new")
      expect(route.method).toEqual("GET")
      expect(route.name).toEqual("login")
      expect(route.defaults).toEqual {flow: "signup"}
    
    it "should be found in the router", ->
      router      = Tower.Middleware.Router
      request     = method: "get", url: "http://www.local.host:3000/login"
      
      controller  = router.find request, {}, (controller) ->
        expect(request.params).toEqual { flow : 'signup', format : null, action : 'new' }
        expect(controller.params).toEqual { flow : 'signup', format : null, action : 'new' }
      
      #controller.callback()

  describe 'resources', ->
    beforeEach ->
      Tower.Application.instance().teardown()
      
      Tower.Route.draw ->
        @resource "user"
        
        @resources "posts", ->
          @resources "comments"
        
        @namespace "admin", ->
          @resources "posts", ->
            @resources "comments"
            
            # /admin/posts/:postId/dashboard
            @member ->
              @get "dashboard"
            
            # /admin/posts/dashboard
            @collection ->
              @get "dashboard"
    
    it 'should have single resource routes', ->
      routes = Tower.Route.all()[0..5]
      
      expect(routes[0].path).toEqual "/user/new.:format?"
      expect(routes[1].path).toEqual "/user.:format?"
      expect(routes[2].path).toEqual "/user.:format?"
      expect(routes[3].path).toEqual "/user/edit.:format?"
      expect(routes[4].path).toEqual "/user.:format?"
      expect(routes[5].path).toEqual "/user.:format?"
      
    it 'should have multiple resource routes', ->
      routes = Tower.Route.all()[6..13]
      
      expect(routes[0].path).toEqual "/posts.:format?"
      expect(routes[0].method).toEqual "GET"
      expect(routes[0].name).toEqual "posts"
      expect(routes[1].path).toEqual "/posts/new.:format?"
      expect(routes[1].method).toEqual "GET"
      expect(routes[2].path).toEqual "/posts.:format?"
      expect(routes[2].method).toEqual "POST"
      expect(routes[3].path).toEqual "/posts/:id.:format?"
      expect(routes[3].method).toEqual "GET"
      expect(routes[4].path).toEqual "/posts/:id/edit.:format?"
      expect(routes[4].method).toEqual "GET"
      expect(routes[5].path).toEqual "/posts/:id.:format?"
      expect(routes[5].method).toEqual "PUT"
      expect(routes[6].path).toEqual "/posts/:id.:format?"
      expect(routes[6].method).toEqual "DELETE"
      
    it 'should have nested routes', ->
      routes = Tower.Route.all()[13..20]
      
      # index
      route = routes[0]
      expect(route.name).toEqual "postComments"
      expect(route.path).toEqual "/posts/:postId/comments.:format?"
      expect(route.method).toEqual "GET"
      
      # new
      route = routes[1]
      expect(route.name).toEqual "newPostComment"
      expect(route.path).toEqual "/posts/:postId/comments/new.:format?"
      expect(route.method).toEqual "GET"
      
      # create
      route = routes[2]
      expect(route.name).toBeFalsy()
      expect(route.path).toEqual "/posts/:postId/comments.:format?"
      expect(route.method).toEqual "POST"
      
      # show
      route = routes[3]
      expect(route.name).toEqual "postComment"
      expect(route.path).toEqual "/posts/:postId/comments/:id.:format?"
      expect(route.method).toEqual "GET"
      
      # edit
      route = routes[4]
      expect(route.name).toEqual "editPostComment"
      expect(route.path).toEqual "/posts/:postId/comments/:id/edit.:format?"
      expect(route.method).toEqual "GET"
      
    it 'should have namespaces', ->
      routes = Tower.Route.all()[20..26]
      
      # index
      route = routes[0]
      expect(route.name).toEqual "adminPosts"
      expect(route.path).toEqual "/admin/posts.:format?"
      expect(route.method).toEqual "GET"
      
      # new
      route = routes[1]
      expect(route.name).toEqual "newAdminPost"
      expect(route.path).toEqual "/admin/posts/new.:format?"
      expect(route.method).toEqual "GET"
      
      # show
      route = routes[3]
      expect(route.name).toEqual "adminPost"
      expect(route.path).toEqual "/admin/posts/:id.:format?"
      expect(route.method).toEqual "GET"
      
    it 'should have namespaces with nesting', ->
      routes = Tower.Route.all()[27..32]
      
      # index
      route = routes[0]
      expect(route.name).toEqual "adminPostComments"
      expect(route.path).toEqual "/admin/posts/:postId/comments.:format?"
      expect(route.method).toEqual "GET"
      
      # new
      route = routes[1]
      expect(route.name).toEqual "newAdminPostComment"
      expect(route.path).toEqual "/admin/posts/:postId/comments/new.:format?"
      expect(route.method).toEqual "GET"
      
      expect(route.urlFor(postId: 8)).toEqual "/admin/posts/8/comments/new"
      
  describe 'url builder', ->
    it 'should build a url from a model class', ->
      url = Tower.urlFor

describe "Tower.Dispatch.Route.DSL", ->
  describe "route", ->
    it "should match routes with keys", ->
      route = new Tower.Route(path: "/users/:id/:tag")
      match = route.match("/users/10/symbols")
      
      expect(match[1]).toEqual("10")
      expect(match[2]).toEqual("symbols")
      
    it "should match routes with splats", ->
      route = new Tower.Route(path: "/users/:id/*categories")
      match = route.match("/users/10/one/two/three")
      
      expect(match[1]).toEqual("10")
      expect(match[2]).toEqual("one/two/three")
      
      expect(route.keys[0]).toEqual { name: 'id', optional: false, splat: false }
      expect(route.keys[1]).toEqual { name: 'categories', optional: false, splat: true }
      
    it "should match routes with optional splats", ->
      route = new Tower.Route(path: "/users/:id(/*categories)")
      match = route.match("/users/10/one/two/three")
      
      expect(match[1]).toEqual("10")
      expect(match[2]).toEqual("one/two/three")
      
      expect(route.keys[0]).toEqual { name: 'id', optional: false, splat: false }
      expect(route.keys[1]).toEqual { name: 'categories', optional: true, splat: true }
      
    it "should match routes with optional formats", ->
      route = new Tower.Route(path: "/users/:id.:format?")
      match = route.match("/users/10.json")
      
      expect(match[1]).toEqual("10")
      expect(match[2]).toEqual("json")
      
      expect(route.keys[0]).toEqual { name: 'id', optional: false, splat: false }
      expect(route.keys[1]).toEqual { name : 'format', optional : true, splat : false }
  
  describe "mapper", ->
    beforeEach ->
      Tower.Application.instance().teardown()
      
      Tower.Route.draw ->
        @match "/login",  to: "sessions#new", via: "get", as: "login", defaults: {flow: "signup"}, constraints: {subdomain: /www/}
        
        @match "/users",          to: "users#index", via: "get"
        @match "/users/:id/edit", to: "users#edit", via: "get"
        @match "/users/:id",      to: "users#show", via: "get"
        @match "/users",          to: "users#create", via: "post"
        @match "/users/:id",      to: "users#update", via: "put"
        @match "/users/:id",      to: "users#destroy", via: "delete"
    
    it "should map", ->
      routes  = Tower.Route.all()
      
      # console.log Tower.Route.first(pattern: "=~": "/users/10/edit")
      
      expect(routes.length).toEqual(7)
      
      route   = routes[0]
      
      expect(route.path).toEqual("/login.:format?")
      expect(route.controller.name).toEqual("sessionsController")
      expect(route.controller.className).toEqual("SessionsController")
      expect(route.controller.action).toEqual("new")
      expect(route.method).toEqual("GET")
      expect(route.name).toEqual("login")
      expect(route.defaults).toEqual {flow: "signup"}
    
    it "should be found in the router", ->
      router      = Tower.Middleware.Router
      request     = method: "get", url: "http://www.local.host:3000/login"
      
      controller  = router.find request, {}, (controller) ->
        expect(request.params).toEqual { flow : 'signup', format : null, action : 'new' }
        expect(controller.params).toEqual { flow : 'signup', format : null, action : 'new' }
      
      #controller.callback()

  describe 'resources', ->
    beforeEach ->
      Tower.Application.instance().teardown()
      
      Tower.Route.draw ->
        @resource "user"
        
        @resources "posts", ->
          @resources "comments"
        
        @namespace "admin", ->
          @resources "posts", ->
            @resources "comments"
            
            # /admin/posts/:postId/dashboard
            @member ->
              @get "dashboard"
            
            # /admin/posts/dashboard
            @collection ->
              @get "dashboard"
    
    it 'should have single resource routes', ->
      routes = Tower.Route.all()[0..5]
      
      expect(routes[0].path).toEqual "/user/new.:format?"
      expect(routes[1].path).toEqual "/user.:format?"
      expect(routes[2].path).toEqual "/user.:format?"
      expect(routes[3].path).toEqual "/user/edit.:format?"
      expect(routes[4].path).toEqual "/user.:format?"
      expect(routes[5].path).toEqual "/user.:format?"
      
    it 'should have multiple resource routes', ->
      routes = Tower.Route.all()[6..13]
      
      expect(routes[0].path).toEqual "/posts.:format?"
      expect(routes[0].method).toEqual "GET"
      expect(routes[0].name).toEqual "posts"
      expect(routes[1].path).toEqual "/posts/new.:format?"
      expect(routes[1].method).toEqual "GET"
      expect(routes[2].path).toEqual "/posts.:format?"
      expect(routes[2].method).toEqual "POST"
      expect(routes[3].path).toEqual "/posts/:id.:format?"
      expect(routes[3].method).toEqual "GET"
      expect(routes[4].path).toEqual "/posts/:id/edit.:format?"
      expect(routes[4].method).toEqual "GET"
      expect(routes[5].path).toEqual "/posts/:id.:format?"
      expect(routes[5].method).toEqual "PUT"
      expect(routes[6].path).toEqual "/posts/:id.:format?"
      expect(routes[6].method).toEqual "DELETE"
      
    it 'should have nested routes', ->
      routes = Tower.Route.all()[13..20]
      
      # index
      route = routes[0]
      expect(route.name).toEqual "postComments"
      expect(route.path).toEqual "/posts/:postId/comments.:format?"
      expect(route.method).toEqual "GET"
      
      # new
      route = routes[1]
      expect(route.name).toEqual "newPostComment"
      expect(route.path).toEqual "/posts/:postId/comments/new.:format?"
      expect(route.method).toEqual "GET"
      
      # create
      route = routes[2]
      expect(route.name).toBeFalsy()
      expect(route.path).toEqual "/posts/:postId/comments.:format?"
      expect(route.method).toEqual "POST"
      
      # show
      route = routes[3]
      expect(route.name).toEqual "postComment"
      expect(route.path).toEqual "/posts/:postId/comments/:id.:format?"
      expect(route.method).toEqual "GET"
      
      # edit
      route = routes[4]
      expect(route.name).toEqual "editPostComment"
      expect(route.path).toEqual "/posts/:postId/comments/:id/edit.:format?"
      expect(route.method).toEqual "GET"
      
    it 'should have namespaces', ->
      routes = Tower.Route.all()[20..26]
      
      # index
      route = routes[0]
      expect(route.name).toEqual "adminPosts"
      expect(route.path).toEqual "/admin/posts.:format?"
      expect(route.method).toEqual "GET"
      
      # new
      route = routes[1]
      expect(route.name).toEqual "newAdminPost"
      expect(route.path).toEqual "/admin/posts/new.:format?"
      expect(route.method).toEqual "GET"
      
      # show
      route = routes[3]
      expect(route.name).toEqual "adminPost"
      expect(route.path).toEqual "/admin/posts/:id.:format?"
      expect(route.method).toEqual "GET"
      
    it 'should have namespaces with nesting', ->
      routes = Tower.Route.all()[27..32]
      
      # index
      route = routes[0]
      expect(route.name).toEqual "adminPostComments"
      expect(route.path).toEqual "/admin/posts/:postId/comments.:format?"
      expect(route.method).toEqual "GET"
      
      # new
      route = routes[1]
      expect(route.name).toEqual "newAdminPostComment"
      expect(route.path).toEqual "/admin/posts/:postId/comments/new.:format?"
      expect(route.method).toEqual "GET"
      
      expect(route.urlFor(postId: 8)).toEqual "/admin/posts/8/comments/new"
      
    #it 'should have "get"', ->
    #  routes = Tower.Route.all()[32..35]
    #  
    #  route = routes[routes.length - 1]
    #  
    #  expect(route.name).toEqual "/admin/posts/:postId/dashboard.:format?"
    #  expect(route.path).toEqual "adminPostDashboard"
    
  #describe 'params', ->
  #  it 'should parse string', ->
  #    param   = new Tower.Dispatch.Param.String("title", modelName: "User")
  #    
  #    result  = param.parse("-Hello+World")
  #    result  = result[0]
  #    
  #    expect(result[0].value).toEqual "Hello"
  #    expect(result[0].operators).toEqual ["!~"]
  #    
  #    expect(result[1].key).toEqual "title"
  #    expect(result[1].value).toEqual "World"
  #    expect(result[1].operators).toEqual ["=~"]
  #    
  #    Tower.Controller.params limit: 20, ->
  #      @param "title"
  #
  #    controller  = new Tower.Controller
  #    controller.params.title = "Hello+World"
  #    criteria    = controller.criteria()
  #    expect(criteria.query).toEqual {title: "=~": "Hello World"}
  #    
  #describe 'url builder', ->
  #  it 'should build a url from a model class', ->
  #    url = Tower.urlFor
  #
###  
describe 'Tower.Dispatch.Param', ->
  describe 'String', ->
    param = null
    beforeEach ->
      param = Tower.Dispatch.Param.create("title", type: "String")
    
    test 'match string', ->
      criteria  = param.toCriteria("Hello+World")
      expect(criteria.query).toEqual { "title": "$match": ["Hello", "World"] }
      
    test 'NOT match string', ->
      criteria  = param.toCriteria("-Hello+-World")
      expect(criteria.query).toEqual { "title": "$notMatch": ["Hello", "World"] }
      
    test 'NOT match and match string', ->
      criteria  = param.toCriteria("-Hello+World")
      expect(criteria.query).toEqual { "title": "$notMatch": ["Hello"], "$match": ["World"] }
      
    test 'regexp', ->
      criteria  = param.toCriteria("/Hello World/i")
      expect(criteria.query).toEqual { "title": "$regex": /Hello World/i }
      
  describe 'Array', ->
    param = null
    beforeEach ->
      param = Tower.Dispatch.Param.create("tags", type: "Array")
      
    test '$all', ->
      criteria  = param.toCriteria("[ruby,javascript]")
      expect(criteria.query).toEqual { "tags": "$all": ["ruby", "javascript"] }
      
    test 'multiple $all ($or)', ->
      criteria  = param.toCriteria("[ruby,rails],[node,javascript]")
      expect(criteria.query).toEqual { "$or": [{"tags": "$all": ["ruby", "rails"]}, {"tags": "$all": ["node", "javascript"]}] }
      
    test '$in', ->
      criteria  = param.toCriteria("ruby,javascript")
      expect(criteria.query).toEqual { "tags": "$in": ["ruby", "javascript"] }
      
    test '$nin with one value', ->
      criteria  = param.toCriteria("^java")
      expect(criteria.query).toEqual { "tags": "$nin": ["java"] }
      
    test '$nin with multiple values', ->
      criteria  = param.toCriteria("^java,^asp")
      expect(criteria.query).toEqual { "tags": "$nin": ["java", "asp"] }
      
    test '$nin and $in together', ->
      criteria  = param.toCriteria("^java,javascript")
      expect(criteria.query).toEqual { "tags": "$nin": ["java"], "$in": ["javascript"] }
      
  describe 'Date', ->
    param = null
    beforeEach ->
      param = Tower.Dispatch.Param.create("createdAt", type: "Date")
    
    test 'exact date', ->
      criteria  = param.toCriteria("12-25-2012")
      expect(criteria.query).toEqual { "createdAt": Tower.date("12-25-2012") }
      
    test 'date range with start and end', ->
      criteria  = param.toCriteria("12-25-2012..12-31-2012")
      expect(criteria.query).toEqual { "createdAt": "$gte": Tower.date("12-25-2012"), "$lte": Tower.date("12-31-2012") }
    
    test 'date range with start and NO end', ->
      criteria  = param.toCriteria("12-25-2012..t")
      expect(criteria.query).toEqual { "createdAt": "$gte": Tower.date("12-25-2012") }
      
    test 'date range with NO start but WITH an end', ->
      criteria  = param.toCriteria("t..12-31-2012")
      expect(criteria.query).toEqual { "createdAt": "$lte": Tower.date("12-31-2012") }
    
    #test 'multiple dates', ->
    
    #test 'exact time', ->
    
    test 'exact datetime', ->
      datetime  = "01-12-2012@3:25:50"
      criteria  = param.toCriteria(datetime)
      expect(criteria.query).toEqual { "createdAt": Tower.date(datetime) }
      
  describe 'Number', ->
    param = null
    
    beforeEach ->
      param = Tower.Dispatch.Param.create("likeCount", type: "Number")
    
    test 'exact number `12`', ->
      criteria  = param.toCriteria("12")
      expect(criteria.query).toEqual { "likeCount": 12.0 }
      
    test 'number range with start and end `12..80`', ->
      criteria  = param.toCriteria("12..80")
      expect(criteria.query).toEqual { "likeCount": "$gte": 12, "$lte": 80 }
    
    test 'number range with start and NO end `12..n`', ->
      criteria  = param.toCriteria("12..n")
      expect(criteria.query).toEqual { "likeCount": "$gte": 12 }
      
    test 'number range with NO start but WITH an end `n..80`', ->
      criteria  = param.toCriteria("n..80")
      expect(criteria.query).toEqual { "likeCount": "$lte": 80 }
    
    #test 'multiple numbers, no ranges `10,100,1000`', ->
    #  criteria  = param.toCriteria("10,100,1000")
    #  expect(criteria.query).toEqual { "likeCount": "$in": [10, 100, 1000] }
    #  
    #test 'multiple numbers with ranges `10,100,1000..1050`', ->
    #  criteria  = param.toCriteria("10,100,1000..1050")
    #  expect(criteria.query).toEqual { "$or": [{"likeCount": {"$in": [10, 100]}}, {"likeCount": {"$gte": 1000, "$lte": 1050}}] }
    #  
    #test 'negative number `-10`', ->
    #  criteria  = param.toCriteria("-10")
    #  expect(criteria.query).toEqual { "likeCount": -10 }
    #
    #test 'NOT number `^10`', ->
    #  criteria  = param.toCriteria("^10")
    #  expect(criteria.query).toEqual { "likeCount": "$neq": 10 }
    #  
    #test 'NOT multiple numbers `^10,^12`', ->
    #  criteria  = param.toCriteria("^10,^12")
    #  expect(criteria.query).toEqual { "likeCount": "$nin": [10, 12] }
    #
    #test 'NOT range `^10..100`', ->
    #  criteria  = param.toCriteria("^10..100")
    #  expect(criteria.query).toEqual { "$nor": [{"likeCount": {"$gte": 10}}, {"likeCount": {"$lte": 100}}] }
    #
    #test 'NIN range with IN range `1..100,^10..50` (is this even possible in mongodb?)', ->
    #  criteria  = param.toCriteria("1..100,^10..50")
    #  expect(criteria.query).toEqual { "$or": [{"likeCount": {"$gte": 1}}, {"likeCount": {"$lte": 100}}], "$nor": [{"likeCount": {"$gte": 10}}, {"likeCount": {"$lte": 50}}] }
###