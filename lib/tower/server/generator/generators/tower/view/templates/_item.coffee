li class: "<%= model.cssName %>", ->
  header class: "header", ->
    h3 @<%= model.name %>.toLabel()
  dl class: "content", -><% for (var i = 0; i < model.attributes.length; i++) { %>
    dt "<%= model.attributes[i].humanName %>:"
    dd @<%= model.name %>.get("<%= model.attributes[i].name %>")<% } %>
  footer class: "footer", ->
    menu ->
      menuItem "Edit", urlFor(@<%= model.name %>, action: "edit")
