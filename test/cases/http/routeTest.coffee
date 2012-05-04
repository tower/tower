describe 'Tower.Dispatch.Route', ->
  describe "dsl", ->
    beforeEach ->
      #Tower.Application.instance().teardown()
      Tower.Route.clear()
      
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
      
      assert.equal routes.length, 7
      
      route   = routes[0]
      
      assert.equal route.path, "/login.:format?"
      assert.equal route.controller.name, "SessionsController"
      assert.equal route.controller.className, "SessionsController"
      assert.equal route.controller.action, "new"
      assert.equal route.methods[0], "GET"
      assert.equal route.name, "login"
      assert.deepEqual route.defaults, {flow: "signup"}
    
    it "should be found in the router", ->
      router      = Tower.Middleware.Router
      request     = method: "get", url: "http://www.local.host:3000/login", header: ->
      
      controller  = router.find request, {}, (controller) ->
        assert.deepEqual request.params, { flow : 'signup', format : "html", action : 'new' }
        assert.deepEqual controller.params, { flow : 'signup', format : "html", action : 'new' }
      
      #controller.callback()
      
  describe 'resources', ->
    beforeEach ->
      #Tower.Application.instance().teardown()
      Tower.Route.clear()
      
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
      assert.equal routes[0].methods[0], "GET"
      assert.equal routes[0].name, "posts"
      assert.equal routes[1].path, "/posts/new.:format?"
      assert.equal routes[1].methods[0], "GET"
      assert.equal routes[2].path, "/posts.:format?"
      assert.equal routes[2].methods[0], "POST"
      assert.equal routes[3].path, "/posts/:id.:format?"
      assert.equal routes[3].methods[0], "GET"
      assert.equal routes[4].path, "/posts/:id/edit.:format?"
      assert.equal routes[4].methods[0], "GET"
      assert.equal routes[5].path, "/posts/:id.:format?"
      assert.equal routes[5].methods[0], "PUT"
      assert.equal routes[6].path, "/posts/:id.:format?"
      assert.equal routes[6].methods[0], "DELETE"
      
    it 'should have nested routes', ->
      routes = Tower.Route.all()[13..20]
      
      # index
      route = routes[0]
      assert.equal route.name, "postComments"
      assert.equal route.path, "/posts/:postId/comments.:format?"
      assert.equal route.methods[0], "GET"
      
      # new
      route = routes[1]
      assert.equal route.name, "newPostComment"
      assert.equal route.path, "/posts/:postId/comments/new.:format?"
      assert.equal route.methods[0], "GET"
      
      # create
      route = routes[2]
      assert.equal route.name, null
      assert.equal route.path, "/posts/:postId/comments.:format?"
      assert.equal route.methods[0], "POST"
      
      # show
      route = routes[3]
      assert.equal route.name, "postComment"
      assert.equal route.path, "/posts/:postId/comments/:id.:format?"
      assert.equal route.methods[0], "GET"
      
      # edit
      route = routes[4]
      assert.equal route.name, "editPostComment"
      assert.equal route.path, "/posts/:postId/comments/:id/edit.:format?"
      assert.equal route.methods[0], "GET"
      
    it 'should have namespaces', ->
      routes = Tower.Route.all()[20..26]
      
      # index
      route = routes[0]
      assert.equal route.name, "adminPosts"
      assert.equal route.path, "/admin/posts.:format?"
      assert.equal route.methods[0], "GET"
      
      # new
      route = routes[1]
      assert.equal route.name, "newAdminPost"
      assert.equal route.path, "/admin/posts/new.:format?"
      assert.equal route.methods[0], "GET"
      
      # show
      route = routes[3]
      assert.equal route.name, "adminPost"
      assert.equal route.path, "/admin/posts/:id.:format?"
      assert.equal route.methods[0], "GET"
      
    it 'should have namespaces with nesting', ->
      routes = Tower.Route.all()[27..32]
      
      # index
      route = routes[0]
      assert.equal route.name, "adminPostComments"
      assert.equal route.path, "/admin/posts/:postId/comments.:format?"
      assert.equal route.methods[0], "GET"
      
      # new
      route = routes[1]
      assert.equal route.name, "newAdminPostComment"
      assert.equal route.path, "/admin/posts/:postId/comments/new.:format?"
      assert.equal route.methods[0], "GET"
      
      assert.equal route.urlFor(postId: 8), "/admin/posts/8/comments/new"
      
  describe 'url builder', ->
    it 'should build a url from a model class', ->
      url = Tower.urlFor
      
  describe 'namespace', ->
  
  test 'root'