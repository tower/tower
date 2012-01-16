require '../../config'

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
