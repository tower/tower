Tower.Route.draw ->
  # @match "(/*path)", to: "application#index"
  @match "/", to: "application#welcome"