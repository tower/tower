<%= app.namespace %>.<%= model.className %> = Tower.Model.extend({<% for (var i = 0; i < model.attributes.length; i++) { %>
  <%= model.attributes[i].name %>: Tower.field({type: '<%= model.attributes[i].type %>'<% if (model.attributes[i].default != null) { %>, default: <%= model.attributes[i].default %><% } %>}),<% } %>
<% for (var i = 0; i < model.relations.length; i++) { %>
  <%= model.relations[i].name %>: Tower.<%= model.relations[i].type %>(),<% } %>

  timestamps: true
});
