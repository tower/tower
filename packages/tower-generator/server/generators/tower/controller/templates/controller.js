<%= controller.namespace %>.<%= controller.className %> = <%= app.namespace %>.ApplicationController.extend({<% for (var i = 0; i < model.attributes.length; i++) { %>
  <%= model.attributes[i].name %>: Tower.param(),<% } %>

  all: Tower.scope()
});
