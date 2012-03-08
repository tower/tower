class <%= app.namespace %>.<%= model.className %> extends Tower.Model
  @field "id", type: "Id"<% for (var i = 0; i < model.attributes.length; i++) { %>
  @field "<%= model.attributes[i].name %>", type: "<%= model.attributes[i].type %>"<% if (model.attributes[i].default != null) { %>, default: <%= model.attributes[i].default %><% } %><% } %>
  <% for (var i = 0; i < model.relations.length; i++) { %>
  @<%= model.relations[i].type %> "<%= model.relations[i].name %>"<% } %>
  
  @timestamps()
