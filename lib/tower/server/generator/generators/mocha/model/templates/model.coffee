require "../config"

<%= model.name %> = null

describe "<%= project.namespace %>.<%= model.className %>", ->
  describe "#fields", ->
    beforeEach (done) ->
      <%= project.namespace %>.<%= model.className %>.destroy =>
        <%= model.name %> = new <%= project.namespace %>.<%= model.className %>
    <% for (var i = 0; i < model.attributes.length; i++) { %>
    test ".<%= model.attributes[i].name %>", ->
      assert.ok <%= model.className %>.get("<%= model.attributes[i].name %>")<% } %>
    
  describe "#relations", ->
  
