Tower.Route.draw ->
  @match "/sign-in", to: "sessions#new", via: "get", as: "login"
  
  # test routes
  @match "/test-routes/default", to: "testRoutes#defaultMethod"
  @match "/test-routes/get", to: "testRoutes#getMethod", via: "get"
  @match "/test-routes/post", to: "testRoutes#postMethod", via: "post"
  @match "/test-routes/put", to: "testRoutes#putMethod", via: "put"
  @match "/test-routes/delete", to: "testRoutes#deleteMethod", via: "delete"
  @match "/test-routes/get-post", to: "testRoutes#getPostMethod", via: ["get", "post"]
  
  # test "json"
  @match "/test-json/default", to: "testJson#defaultMethod", via: ["get", "post", "put", "delete"]
  @match "/test-json/post", to: "testJson#postMethod", via: "post"
  
  # test rendering
  @match "/custom/renderHelloWorld", to: "custom#renderHelloWorld"

  @match "/", to: "application#welcome"
