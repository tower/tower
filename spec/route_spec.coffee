Metro    = require('../lib/metro')

describe "route", ->
  describe "mapper", ->
    beforeEach ->
      Metro.Application.routes().clear()
      
      Metro.Application.routes().draw ->
        @match "/login",          to: "sessions#new", via: "get", as: "login"
        
        @match "/users",          to: "users#index", via: "get"
        @match "/users/:id/edit", to: "users#edit", via: "get"
        @match "/users/:id",      to: "users#show", via: "get"
        @match "/users",          to: "users#create", via: "post"
        @match "/users/:id",      to: "users#update", via: "put"
        @match "/users/:id",      to: "users#destroy", via: "delete"
    
    it "should map", ->
      routes  = Metro.Application.routes().set
      
      expect(routes.length).toEqual(7)
      
      route   = routes[0]
      
      expect(route.path).toEqual("/login(.:format)")
      