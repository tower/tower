tableFor "users", (t) ->
  t.head ->
    t.row -><% for (var i = 0; i < model.attributes.length; i++) { %>
      t.cell "<%= model.attributes[i].name %>", sort: true<% } %>
      t.cell()
      t.cell()
      t.cell()
  t.body ->
    for <%= model.resourceName %> in @<%= model.collectionName %>
      t.row -><% for (var i = 0; i < model.attributes.length; i++) { %>
        t.cell <%= model.resourceName %>.get("<%= model.attributes[i].name %>")<% } %>
        t.cell linkTo 'Show', <%= model.resourceName %>
        t.cell linkTo 'Edit', edit<%= model.className %>Path(<%= model.resourceName %>)
        t.cell linkTo 'Destroy', <%= model.resourceName %>, method: "delete"
  linkTo 'New <%= model.className %>', new<%= model.className %>Path()
