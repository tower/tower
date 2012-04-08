tableFor "<%= model.namePlural %>", (t) ->
  t.head ->
    t.row -><% for (var i = 0; i < model.attributes.length; i++) { %>
      t.header "<%= model.attributes[i].name %>", sort: true<% } %>
  t.body ->
    for <%= model.name %> in @<%= model.namePlural %>
      t.row class: "<%= model.name %>", "data-id": <%= model.name %>.get('id').toString(), -><% for (var i = 0; i < model.attributes.length; i++) { %>
        t.cell -> <%= model.name %>.get("<%= model.attributes[i].name %>")<% } %>
        t.cell -> 
          linkTo 'Show', urlFor(<%= model.name %>)
          span "|"
          linkTo 'Edit', urlFor(<%= model.name %>, action: "edit")
          span "|"
          linkTo 'Destroy', urlFor(<%= model.name %>), "data-method": "delete"
  t.foot ->
    t.row ->
      t.cell colspan: <%= model.attributes.length + 3 %>, ->
        linkTo 'New <%= model.className %>', urlFor(<%= app.namespace %>.<%= model.className %>, action: "new")

