formFor "<%= model.name %>", -><% for (var i = 0; i < model.attributes.length; i++) { %>
  field "<%= model.attributes[i].name %>", as: "<%= model.attributes[i].fieldType %>"
  <% } %>
  submit "Submit"
