@title = "<%= model.humanName %>"

partial "flash"

text '{{#with resource}}'
dl class: "content", -><% for (var i = 0; i < model.attributes.length; i++) { %>
  dt "<%= model.attributes[i].humanName %>:"
  dd '{{<%= model.attributes[i].name %>}}'<% } %>
text '{{/with}}'