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
      Metro.Route.teardown()
      
      Metro.Route.draw ->
        @match "/login",  to: "sessions#new", via: "get", as: "login", defaults: {flow: "signup"}
        
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
      expect(route.controller.name).toEqual("sessions_controller")
      expect(route.controller.class_name).toEqual("SessionsController")
      expect(route.controller.action).toEqual("new")
      expect(route.method).toEqual("get")
      expect(route.name).toEqual("login")
      expect(route.defaults).toEqual {flow: "signup"}
    
    it "should be found in the router", ->
      Metro.Application.initialize()
      
      router      = new Metro.Middleware.Router
      request     = {method: "get", url: "/login"}
      controller  = router.process(request)
      
      expect(request.params).toEqual { flow : 'signup', format : null, action : 'new' }
      
      expect(controller.params).toEqual { flow : 'signup', format : null, action : 'new' }