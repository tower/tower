require '../../config'

describe 'Tower.Dispatch.Route', ->
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
      
      assert.equal routes[0].path, "/user/new.:format?"
      assert.equal routes[1].path, "/user.:format?"
      assert.equal routes[2].path, "/user.:format?"
      assert.equal routes[3].path, "/user/edit.:format?"
      assert.equal routes[4].path, "/user.:format?"
      assert.equal routes[5].path, "/user.:format?"
      
    it 'should have multiple resource routes', ->
      routes = Tower.Route.all()[6..13]
      
      assert.equal routes[0].path, "/posts.:format?"
      assert.equal routes[0].method, "GET"
      assert.equal routes[0].name, "posts"
      assert.equal routes[1].path, "/posts/new.:format?"
      assert.equal routes[1].method, "GET"
      assert.equal routes[2].path, "/posts.:format?"
      assert.equal routes[2].method, "POST"
      assert.equal routes[3].path, "/posts/:id.:format?"
      assert.equal routes[3].method, "GET"
      assert.equal routes[4].path, "/posts/:id/edit.:format?"
      assert.equal routes[4].method, "GET"
      assert.equal routes[5].path, "/posts/:id.:format?"
      assert.equal routes[5].method, "PUT"
      assert.equal routes[6].path, "/posts/:id.:format?"
      assert.equal routes[6].method, "DELETE"
      
    it 'should have nested routes', ->
      routes = Tower.Route.all()[13..20]
      
      # index
      route = routes[0]
      assert.equal route.name, "postComments"
      assert.equal route.path, "/posts/:postId/comments.:format?"
      assert.equal route.method, "GET"
      
      # new
      route = routes[1]
      assert.equal route.name, "newPostComment"
      assert.equal route.path, "/posts/:postId/comments/new.:format?"
      assert.equal route.method, "GET"
      
      # create
      route = routes[2]
      assert.equal route.name, null
      assert.equal route.path, "/posts/:postId/comments.:format?"
      assert.equal route.method, "POST"
      
      # show
      route = routes[3]
      assert.equal route.name, "postComment"
      assert.equal route.path, "/posts/:postId/comments/:id.:format?"
      assert.equal route.method, "GET"
      
      # edit
      route = routes[4]
      assert.equal route.name, "editPostComment"
      assert.equal route.path, "/posts/:postId/comments/:id/edit.:format?"
      assert.equal route.method, "GET"
      
    it 'should have namespaces', ->
      routes = Tower.Route.all()[20..26]
      
      # index
      route = routes[0]
      assert.equal route.name, "adminPosts"
      assert.equal route.path, "/admin/posts.:format?"
      assert.equal route.method, "GET"
      
      # new
      route = routes[1]
      assert.equal route.name, "newAdminPost"
      assert.equal route.path, "/admin/posts/new.:format?"
      assert.equal route.method, "GET"
      
      # show
      route = routes[3]
      assert.equal route.name, "adminPost"
      assert.equal route.path, "/admin/posts/:id.:format?"
      assert.equal route.method, "GET"
      
    it 'should have namespaces with nesting', ->
      routes = Tower.Route.all()[27..32]
      
      # index
      route = routes[0]
      assert.equal route.name, "adminPostComments"
      assert.equal route.path, "/admin/posts/:postId/comments.:format?"
      assert.equal route.method, "GET"
      
      # new
      route = routes[1]
      assert.equal route.name, "newAdminPostComment"
      assert.equal route.path, "/admin/posts/:postId/comments/new.:format?"
      assert.equal route.method, "GET"
      
      assert.equal route.urlFor(postId: 8), "/admin/posts/8/comments/new"
      
  describe 'url builder', ->
    it 'should build a url from a model class', ->
      url = Tower.urlFor

describe "Tower.Dispatch.Route.DSL", ->
  describe "route", ->
    it "should match routes with keys", ->
      route = new Tower.Route(path: "/users/:id/:tag")
      match = route.match("/users/10/symbols")
      
      assert.equal match[1], "10"
      assert.equal match[2], "symbols"
      
    it "should match routes with splats", ->
      route = new Tower.Route(path: "/users/:id/*categories")
      match = route.match("/users/10/one/two/three")
      
      assert.equal match[1], "10"
      assert.equal match[2], "one/two/three"
      
      assert.deepEqual route.keys[0], { name: 'id', optional: false, splat: false }
      assert.deepEqual route.keys[1], { name: 'categories', optional: false, splat: true }
      
    it "should match routes with optional splats", ->
      route = new Tower.Route(path: "/users/:id(/*categories)")
      match = route.match("/users/10/one/two/three")
      
      assert.equal match[1], "10"
      assert.equal match[2], "one/two/three"
      
      assert.deepEqual route.keys[0], { name: 'id', optional: false, splat: false }
      assert.deepEqual route.keys[1], { name: 'categories', optional: true, splat: true }
      
    it "should match routes with optional formats", ->
      route = new Tower.Route(path: "/users/:id.:format?")
      match = route.match("/users/10.json")
      
      assert.equal match[1], "10"
      assert.equal match[2], "json"
      
      assert.deepEqual route.keys[0], { name: 'id', optional: false, splat: false }
      assert.deepEqual route.keys[1], { name : 'format', optional : true, splat : false }
  
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
      
      assert.equal routes.length,(7)
      
      route   = routes[0]
      
      assert.equal route.path, "/login.:format?"
      assert.equal route.controller.name, "sessionsController"
      assert.equal route.controller.className, "SessionsController"
      assert.equal route.controller.action, "new"
      assert.equal route.method, "GET"
      assert.equal route.name, "login"
      assert.deepEqual route.defaults, {flow: "signup"}
    
    it "should be found in the router", ->
      router      = Tower.Middleware.Router
      request     = method: "get", url: "http://www.local.host:3000/login"
      
      controller  = router.find request, {}, (controller) ->
        assert.deepEqual request.params, { flow : 'signup', format : null, action : 'new' }
        assert.deepEqual controller.params, { flow : 'signup', format : null, action : 'new' }
      
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
      
      assert.equal routes[0].path, "/user/new.:format?"
      assert.equal routes[1].path, "/user.:format?"
      assert.equal routes[2].path, "/user.:format?"
      assert.equal routes[3].path, "/user/edit.:format?"
      assert.equal routes[4].path, "/user.:format?"
      assert.equal routes[5].path, "/user.:format?"
      
    it 'should have multiple resource routes', ->
      routes = Tower.Route.all()[6..13]
      
      assert.equal routes[0].path, "/posts.:format?"
      assert.equal routes[0].method, "GET"
      assert.equal routes[0].name, "posts"
      assert.equal routes[1].path, "/posts/new.:format?"
      assert.equal routes[1].method, "GET"
      assert.equal routes[2].path, "/posts.:format?"
      assert.equal routes[2].method, "POST"
      assert.equal routes[3].path, "/posts/:id.:format?"
      assert.equal routes[3].method, "GET"
      assert.equal routes[4].path, "/posts/:id/edit.:format?"
      assert.equal routes[4].method, "GET"
      assert.equal routes[5].path, "/posts/:id.:format?"
      assert.equal routes[5].method, "PUT"
      assert.equal routes[6].path, "/posts/:id.:format?"
      assert.equal routes[6].method, "DELETE"
      
    it 'should have nested routes', ->
      routes = Tower.Route.all()[13..20]
      
      # index
      route = routes[0]
      assert.equal route.name, "postComments"
      assert.equal route.path, "/posts/:postId/comments.:format?"
      assert.equal route.method, "GET"
      
      # new
      route = routes[1]
      assert.equal route.name, "newPostComment"
      assert.equal route.path, "/posts/:postId/comments/new.:format?"
      assert.equal route.method, "GET"
      
      # create
      route = routes[2]
      assert.equal route.name, null
      assert.equal route.path, "/posts/:postId/comments.:format?"
      assert.equal route.method, "POST"
      
      # show
      route = routes[3]
      assert.equal route.name, "postComment"
      assert.equal route.path, "/posts/:postId/comments/:id.:format?"
      assert.equal route.method, "GET"
      
      # edit
      route = routes[4]
      assert.equal route.name, "editPostComment"
      assert.equal route.path, "/posts/:postId/comments/:id/edit.:format?"
      assert.equal route.method, "GET"
      
    it 'should have namespaces', ->
      routes = Tower.Route.all()[20..26]
      
      # index
      route = routes[0]
      assert.equal route.name, "adminPosts"
      assert.equal route.path, "/admin/posts.:format?"
      assert.equal route.method, "GET"
      
      # new
      route = routes[1]
      assert.equal route.name, "newAdminPost"
      assert.equal route.path, "/admin/posts/new.:format?"
      assert.equal route.method, "GET"
      
      # show
      route = routes[3]
      assert.equal route.name, "adminPost"
      assert.equal route.path, "/admin/posts/:id.:format?"
      assert.equal route.method, "GET"
      
    it 'should have namespaces with nesting', ->
      routes = Tower.Route.all()[27..32]
      
      # index
      route = routes[0]
      assert.equal route.name, "adminPostComments"
      assert.equal route.path, "/admin/posts/:postId/comments.:format?"
      assert.equal route.method, "GET"
      
      # new
      route = routes[1]
      assert.equal route.name, "newAdminPostComment"
      assert.equal route.path, "/admin/posts/:postId/comments/new.:format?"
      assert.equal route.method, "GET"
      
      assert.equal route.urlFor(postId: 8), "/admin/posts/8/comments/new"
      
    #it 'should have "get"', ->
    #  routes = Tower.Route.all()[32..35]
    #  
    #  route = routes[routes.length - 1]
    #  
    #  assert.equal route.name, "/admin/posts/:postId/dashboard.:format?"
    #  assert.equal route.path, "adminPostDashboard"
    
  #describe 'params', ->
  #  it 'should parse string', ->
  #    param   = new Tower.Dispatch.Param.String("title", modelName: "User")
  #    
  #    result  = param.parse("-Hello+World")
  #    result  = result[0]
  #    
  #    assert.equal result[0].value, "Hello"
  #    assert.equal result[0].operators, ["!~"]
  #    
  #    assert.equal result[1].key, "title"
  #    assert.equal result[1].value, "World"
  #    assert.equal result[1].operators, ["=~"]
  #    
  #    Tower.Controller.params limit: 20, ->
  #      @param "title"
  #
  #    controller  = new Tower.Controller
  #    controller.params.title = "Hello+World"
  #    criteria    = controller.criteria()
  #    assert.equal criteria.query, {title: "=~": "Hello World"}
  #    
  #describe 'url builder', ->
  #  it 'should build a url from a model class', ->
  #    url = Tower.urlFor
  #