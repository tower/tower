Metro.Application.routes().draw ->
  @match "/login",          to: "sessions#new", via: "get", as: "login"