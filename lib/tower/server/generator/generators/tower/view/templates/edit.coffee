@title = t("headers.edit", name: "<%= model.className %>")

partial "form"

contentFor "sidebar", ->
  header class: "widget header", ->
    h2 @<%= model.name %>.toLabel()