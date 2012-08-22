<% if (app.isStatic) { %>
text '{{#with resource}}'
<% for (var i = 0; i < model.attributes.length; i++) { %>
div class: 'control-group', ->
  div class: 'controls', ->
    p "<%= model.attributes[i].humanName %>:"
    text '{{view Ember.TextField valueBinding="<%= model.attributes[i].name %>"}}'
    text '{{#with errors}}'
    span class: 'help-inline error', '{{<%= model.attributes[i].name %>}}'
    text '{{/with}}'
<% } %>
    a '{{action submit target="resource"}}', 'Submit User'
text '{{/with}}'
<% } else { %>
text '{{#with resource}}'
<% for (var i = 0; i < model.attributes.length; i++) { %>
div class: 'control-group', ->
  div class: 'controls', ->
    p "<%= model.attributes[i].humanName %>:"
    text '{{view Ember.TextField valueBinding="<%= model.attributes[i].name %>"}}'
    text '{{#with errors}}'
    span class: 'help-inline error', '{{<%= model.attributes[i].name %>}}'
    text '{{/with}}'
<% } %>
    a '{{action submit target="resource"}}', 'Submit User'
text '{{/with}}'
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