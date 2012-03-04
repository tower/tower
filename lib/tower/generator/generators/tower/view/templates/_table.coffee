tableFor "<%= model.pluralName %>", (t) ->
  t.head ->
    t.row -><% for (var i = 0; i < model.attributes.length; i++) { %>
      t.cell "<%= model.attributes[i].name %>", sort: true<% } %>
      t.cell()
      t.cell()
      t.cell()
  t.body ->
    for <%= model.name %> in @<%= model.pluralName %>
      t.row -><% for (var i = 0; i < model.attributes.length; i++) { %>
        t.cell -> <%= model.name %>.get("<%= model.attributes[i].name %>")<% } %>
        t.cell -> linkTo 'Show', urlFor(<%= model.name %>)
        t.cell -> linkTo 'Edit', urlFor(<%= model.name %>, action: "edit")
        t.cell -> linkTo 'Destroy', urlFor(<%= model.name %>), method: "delete"
  t.foot ->
    linkTo 'New <%= model.className %>', urlFor(<%= model.namespacedClassName %>, action: "new")
