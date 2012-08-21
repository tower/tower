<% if (app.isStatic) { %>
formFor @<%= model.name %>, (f) ->
  f.fieldset (fields) -><% for (var i = 0; i < model.attributes.length; i++) { %>
    fields.field '<%= model.attributes[i].name %>', as: '<%= model.attributes[i].fieldType %>'<% } %>
  f.fieldset (fields) ->
    fields.submit 'Submit'
<% } else { %>
formFor @<%= model.name %>, (f) ->
  f.fieldset (fields) -><% for (var i = 0; i < model.attributes.length; i++) { %>
    fields.field '<%= model.attributes[i].name %>', as: '<%= model.attributes[i].fieldType %>'<% } %>
  f.fieldset (fields) ->
    fields.submit 'Submit'
<% } %>

###
# This is how an input temporarily needs to be built so it works with ember:
text '{{#with resource}}'
div class: 'control-group', ->
  div class: 'controls', ->
    text '{{view Ember.TextField valueBinding="title"}}'
    text '{{#with errors}}'
    span class: 'help-inline error', '{{title}}'
    text '{{/with}}'
text '{{/with}}'
###