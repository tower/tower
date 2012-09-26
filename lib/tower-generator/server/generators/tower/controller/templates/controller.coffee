class <%= controller.namespace %>.<%= controller.className %> extends <%= app.namespace %>.ApplicationController<% for (var i = 0; i < model.attributes.length; i++) { %>
  @param '<%= model.attributes[i].name %>'<% } %>

  @scope 'all'
