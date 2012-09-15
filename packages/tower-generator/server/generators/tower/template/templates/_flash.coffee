text '{{#if getFlash.error}}'
div class: "alert alert-error", ->
  a class: "close", data: {dismiss: "alert"}, href: "#", -> "x"
  h1 "Error!"
  h4 '{{getFlash.error}}'
text '{{/if}}'

text '{{#if getFlash.success}}'
div class: "alert alert-success", ->
  a class: "close", data: {dismiss: "alert"}, href: "#", -> "x"
  h1 "Success!"
  h4 '{{getFlash.success}}'
text '{{/if}}'

text '{{#if getFlash.info}}'
div class: "alert alert-info", ->
  a class: "close", data: {dismiss: "alert"}, href: "#", -> "x"
  h1 "Important!"
  h4 '{{getFlash.info}}'
text '{{/if}}'
