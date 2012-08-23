if @flash.error
  div class: "alert alert-error", ->
    a class: "close", data: {dismiss: "alert"}, href: "#", -> "x"
    h1 "Error!"
    h4 @flash.error
if @flash.success
  div class: "alert alert-success", ->
    a class: "close", data: {dismiss: "alert"}, href: "#", -> "x"
    h1 "Success!"
    h4 @flash.success
if @flash.info
  div class: "alert alert-info", ->
    a class: "close", data: {dismiss: "alert"}, href: "#", -> "x"
    h1 "Important!"
    h4 @flash.info