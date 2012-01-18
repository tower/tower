<%= model.namespace %>.<%= model.className %>Helper =
  <%= model.name %>Elements: ->
    $(".<%= model.cssName %>")
