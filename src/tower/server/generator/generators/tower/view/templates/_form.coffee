formFor @<%= model.name %>, (f) ->
  f.fieldset (fields) -><% for (var i = 0; i < model.attributes.length; i++) { %>
    fields.field "<%= model.attributes[i].name %>", as: "<%= model.attributes[i].fieldType %>"<% } %>
  f.fieldset (fields) ->
    fields.submit "Submit"
