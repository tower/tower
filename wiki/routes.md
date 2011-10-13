# Routes

``` coffeescript
Metro.Application.routes().draw ->
  @match "/login",          to: "sessions#new", via: "get", as: "login"
  
  @match "/posts",          to: "posts#index", via: "get"
  @match "/posts/:id/edit", to: "posts#edit", via: "get"
  @match "/posts/:id",      to: "posts#show", via: "get"
  @match "/posts",          to: "posts#create", via: "post"
  @match "/posts/:id",      to: "posts#update", via: "put"
  @match "/posts/:id",      to: "posts#destroy", via: "delete"
```
