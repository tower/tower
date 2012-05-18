<%= model.name %> = null

describe "<%= app.namespace %>.<%= model.className %>", ->
  describe "fields", ->
    beforeEach (done) ->
      <%= model.name %> = new <%= app.namespace %>.<%= model.className %><% for (var i = 0; i < model.attributes.length; i++) { %>
        <%= model.attributes[i].name %>: "<%= model.attributes[i].value %>"<% } %>

      done()
<% for (var i = 0; i < model.attributes.length; i++) { %>
    test "<%= model.attributes[i].name %>", ->
      assert.ok <%= model.name %>.get("<%= model.attributes[i].name %>")
<% } %>
  describe "relations", ->

