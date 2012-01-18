tableFor "users", (t) ->
  t.head ->
    t.row -><% for (var i = 0; i < model.attributes.length; i++) { %>
      t.cell "<%= model.attributes[i].name %>", sort: true<% } %>
      t.cell()
      t.cell()
      t.cell()
  t.body ->
    for <%= model.name %> in @<%= model.pluralName %>
      t.row -><% for (var i = 0; i < model.attributes.length; i++) { %>
        t.cell <%= model.name %>.get("<%= model.attributes[i].name %>")<% } %>
        t.cell linkTo 'Show', <%= model.name %>
        t.cell linkTo 'Edit', edit<%= model.className %>Path(<%= model.name %>)
        t.cell linkTo 'Destroy', <%= model.name %>, method: "delete"
  linkTo 'New <%= model.className %>', new<%= model.className %>Path()
