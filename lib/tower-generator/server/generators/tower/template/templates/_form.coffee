text '{{#with resource}}'
form ->
  fieldset ->
    ul class: 'fields', -><% for (var i = 0; i < model.attributes.length; i++) { %>
      li class: 'control-group', ->
        div class: 'controls', ->
          label '<%= model.attributes[i].humanName %>:'
          text '{{view Ember.TextField valueBinding="<%= model.attributes[i].name %>"}}'
          text '{{#with errors}}'
          span class: 'help-inline error', '{{<%= model.attributes[i].name %>}}'
          text '{{/with}}'<% } %>
      li ->
        a '{{action submit target="resource"}}', 'Submit'
text '{{/with}}'
