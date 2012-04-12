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
      
      assert.equal routes.length, 7
      
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
