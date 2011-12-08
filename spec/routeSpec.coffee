require './helper'

describe "route", ->
  describe "route", ->
    it "should match routes with keys", ->
      route = new Metro.Route(path: "/users/:id/:tag")
      match = route.match("/users/10/symbols")
      
      expect(match[1]).toEqual("10")
      expect(match[2]).toEqual("symbols")
      
    it "should match routes with splats", ->
      route = new Metro.Route(path: "/users/:id/*categories")
      match = route.match("/users/10/one/two/three")
      
      expect(match[1]).toEqual("10")
      expect(match[2]).toEqual("one/two/three")
      
      expect(route.keys[0]).toEqual { name: 'id', optional: false, splat: false }
      expect(route.keys[1]).toEqual { name: 'categories', optional: false, splat: true }
      
    it "should match routes with optional splats", ->
      route = new Metro.Route(path: "/users/:id(/*categories)")
      match = route.match("/users/10/one/two/three")
      
      expect(match[1]).toEqual("10")
      expect(match[2]).toEqual("one/two/three")
      
      expect(route.keys[0]).toEqual { name: 'id', optional: false, splat: false }
      expect(route.keys[1]).toEqual { name: 'categories', optional: true, splat: true }
      
    it "should match routes with optional formats", ->
      route = new Metro.Route(path: "/users/:id.:format?")
      match = route.match("/users/10.json")
      
      expect(match[1]).toEqual("10")
      expect(match[2]).toEqual("json")
      
      expect(route.keys[0]).toEqual { name: 'id', optional: false, splat: false }
      expect(route.keys[1]).toEqual { name : 'format', optional : true, splat : false }
  
  describe "mapper", ->
    beforeEach ->
      Metro.Application.instance().teardown()
      
      Metro.Route.draw ->
        @match "/login",  to: "sessions#new", via: "get", as: "login", defaults: {flow: "signup"}, constraints: {subdomain: /www/}
        
        @match "/users",          to: "users#index", via: "get"
        @match "/users/:id/edit", to: "users#edit", via: "get"
        @match "/users/:id",      to: "users#show", via: "get"
        @match "/users",          to: "users#create", via: "post"
        @match "/users/:id",      to: "users#update", via: "put"
        @match "/users/:id",      to: "users#destroy", via: "delete"
    
    it "should map", ->
      routes  = Metro.Route.all()
      
      # console.log Metro.Route.first(pattern: "=~": "/users/10/edit")
      
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
      router      = Metro.Middleware.Routes
      request     = method: "get", url: "http://www.local.host:3000/login"
      
      controller  = router.find request, {}, (controller) ->
        expect(request.params).toEqual { flow : 'signup', format : null, action : 'new' }
        expect(controller.params).toEqual { flow : 'signup', format : null, action : 'new' }
      
      #controller.callback()

  describe 'resources', ->
    beforeEach ->
      Metro.Application.instance().teardown()
      
      Metro.Route.draw ->
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
      routes = Metro.Route.all()[0..5]
      
      expect(routes[0].path).toEqual "/user/new.:format?"
      expect(routes[1].path).toEqual "/user.:format?"
      expect(routes[2].path).toEqual "/user.:format?"
      expect(routes[3].path).toEqual "/user/edit.:format?"
      expect(routes[4].path).toEqual "/user.:format?"
      expect(routes[5].path).toEqual "/user.:format?"
      
    it 'should have multiple resource routes', ->
      routes = Metro.Route.all()[6..13]
    
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
      routes = Metro.Route.all()[13..20]
      
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
      routes = Metro.Route.all()[20..26]
      
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
      routes = Metro.Route.all()[27..32]
      
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
    #  routes = Metro.Route.all()[32..35]
    #  
    #  route = routes[routes.length - 1]
    #  
    #  expect(route.name).toEqual "/admin/posts/:postId/dashboard.:format?"
    #  expect(route.path).toEqual "adminPostDashboard"
    
  describe 'params', ->
    it 'should parse string', ->
      param   = new Metro.Net.Param.String("title", modelName: "User")
      
      result  = param.parse("-Hello+World")
      result  = result[0]
      
      expect(result[0].value).toEqual "Hello"
      expect(result[0].operators).toEqual ["!~"]
      
      expect(result[1].key).toEqual "title"
      expect(result[1].value).toEqual "World"
      expect(result[1].operators).toEqual ["=~"]
      
    it 'should parse time', ->
      Metro.Controller.params limit: 20, ->
        @param "title"