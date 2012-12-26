Tower.Route.draw ->
  @resources 'monkeys'
  @resources 'birds'
  @match "/", to: "application#welcome"
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
    "testIP"
  #  "renderCoffeeKupInline"
  ]

  for action in actions
    @match "/custom/#{action}", to: "custom##{action}"

  @match "/custom/new", to: "custom#new"
  @match "/custom/:id", to: "custom#show"
  @match "/custom/:id/edit", to: "custom#edit"
  @match "/custom/:id", to: "custom#update", via: ["put"]
  @match "/custom/:id", to: "custom#destroy", via: ["delete"]

  actions = [
    'acceptJSON'
    'acceptUndefined'
    'acceptCharsetUTF8'
    'acceptCharsetISO'
  ]

  for action in actions
    @match "/headers/#{action}", to: "headers##{action}"

  @resources 'attachments'
  @resources 'posts'
  @resources 'users'

  # for the client, so we can test saving them with ajax
  # @resources 'addresses'
  # @resources 'groups'
  # @resources 'memberships'
  # @resources 'parents'
  #@match '/users', via: ['post'], to: 'users#index'

  @resources "posts"
