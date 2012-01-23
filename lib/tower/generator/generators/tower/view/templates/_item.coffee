li class: "<%= model.cssName %>", ->
  header class: "header", ->
    h3 @<%= model.name %>.toLabel()
  dl class: "content", -><% for (var i = 0; i < model.attributes.length; i++) { %>
    dt "<%= model.attributes[i].humanName %>:"
    dd @<%= model.name %>.<%= model.attributes[i].name %><% } %>
  footer class: "footer", ->
    menu ->
      menuItem "Edit", edit<%= model.className %>Path(@<%= model.name %>)
      menuItem "Back", <%= model.pluralName %>Path
