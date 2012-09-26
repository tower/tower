@title = "Editing <%= model.className %>"

partial "flash"
partial "form"

contentFor "sidebar", ->
  header class: "widget header", ->
    h2 @<%= model.name %>.toLabel()