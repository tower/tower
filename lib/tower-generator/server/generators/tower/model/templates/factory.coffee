Tower.Factory.define '<%= model.name %>', -><% if (model.attributes.length) { %>
<% for (var i = 0; i < model.attributes.length; i++) { var attributes = model.attributes[i]; -%><% if (attributes.fakeKey) { %>
  <%= attributes.name %>: Tower.random('<%= attributes.fakeKey %>')
<% } -%><% } %><% } %>
