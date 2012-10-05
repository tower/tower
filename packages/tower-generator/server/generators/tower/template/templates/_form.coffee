text '{{#with resource}}'
form ->
  fieldset ->
    ul class: 'fields', -><% for (var i = 0; i < model.attributes.length; i++) { var attributes = model.attributes[i]; %>
      li class: 'control-group', ->
        div class: 'controls', ->
          label '<%= attributes.humanName %>:'<% if (attributes.fieldType == 'text') { %>
          text '{{view Ember.TextArea valueBinding="<%= attributes.name %>"}}'<% } else if (attributes.fieldType == 'boolean') { %>
          text '{{view Ember.Checkbox checkedBinding="<%= attributes.name %>"}}'<% } else { %>
          text '{{view Ember.TextField valueBinding="<%= attributes.name %>"}}'<% } %>
          text '{{#with errors}}'
          span class: 'help-inline error', '{{<%= model.attributes[i].name %>}}'
          text '{{/with}}'<% } %>
      li ->
        a '{{action submit target="resource"}}', 'Submit'
text '{{/with}}'
