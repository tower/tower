<%= controller.namespace %>.<%= model.className %>Helper =
  <%= model.name %>Elements: ->
    $(".<%= model.pluralParamName %>")
