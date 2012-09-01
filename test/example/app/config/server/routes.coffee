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
  @match "/custom", to: "custom#index"
  @match "/custom", to: "custom#create", via: ["post"]

  actions = [
    "renderHelloWorld"
    "renderCoffeeKupFromTemplate"
    "renderHelloWorldFromVariable"
    "renderWithExplicitStringTemplateAsAction"
    "renderActionUpcasedHelloWorldAsString"
    "renderActionUpcasedHelloWorld"
    "renderJsonHelloWorld"
    "renderJsonHelloWorldWithParams"
    "renderJsonHelloWorldWithStatus"
    "testCreateCallback"
    "testNoCallback"
  #  "renderCoffeeKupInline"
  ]

  for action in actions
    @match "/custom/#{action}", to: "custom##{action}"

  @match "/custom/new", to: "custom#new"
  @match "/custom/:id", to: "custom#show"
  @match "/custom/:id/edit", to: "custom#edit"
  @match "/custom/:id", to: "custom#update", via: ["put"]
  @match "/custom/:id", to: "custom#destroy", via: ["delete"]
  
  @resources 'posts'
  @resources 'users'
  #@match '/users', via: ['post'], to: 'users#index'
  @match "/", to: "application#welcome"

  @resources "posts"
