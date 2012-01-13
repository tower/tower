class <%= model.className %> extends Tower.Model
  @field "id", type: "Id"<% for (var i = 0; i < model.attributes.length; i++) { %>
  @field "<%= model.attributes[i].name %>", type: "<%= model.attributes[i].type %>"
  <% } %>