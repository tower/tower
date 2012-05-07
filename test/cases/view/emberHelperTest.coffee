describe "Tower.View.EmberHelper", ->  
  view = null
  user = null

  beforeEach ->
    view = Tower.View.create()

  describe 'each', ->
    beforeEach (done) ->
      
      App.User.insert firstName: "Lance", (error, record) =>
        user = record
        App.User.insert firstName: "Dane", done
    
    test 'hEach("App.User")', ->
      template = ->
        hEach 'App.User'
      
      view.render template: template, (error, result) ->
        assert.equal result, """
{{#each App.User}}
"""
    test 'hEach("App.User", ->)', ->
      template = ->
        hEach 'App.User', ->
      
      view.render template: template, (error, result) ->
        assert.equal result, """
{{#each App.User}}
{{/each}}
"""

    test 'hEach("App.User", key: "value")', ->
      template = ->
        hEach 'App.User', key: "value"
      
      view.render template: template, (error, result) ->
        assert.equal result, """
{{#each App.User key="value"}}
"""

    test 'hEach("App.User", -> li "{{firstName}}")', ->
      template = ->
        hEach 'App.User', ->
          li '{{firstName}}'
      
      view.render template: template, (error, result) ->
        assert.equal result, """
{{#each App.User}}
<li>{{firstName}}</li>
{{/each}}
"""

  test 'hWith("App.User", ->)', ->
    template = ->
      hWith 'App.User', ->
    
    view.render template: template, (error, result) ->
      assert.equal result, """
{{#with App.User}}
{{/with}}
"""

  test 'hBindAttr(src: "src")', ->
    template = ->
      hBindAttr src: "src", ->
    
    view.render template: template, (error, result) ->
      assert.equal result, """
{{bindAttr src="src"}}
"""
  test 'hAction("anAction", target: "App.viewStates")', ->
    template = ->
      hAction("anAction", target: "App.viewStates")
    
    view.render template: template, (error, result) ->
      assert.equal result, """
{{action "anAction" target="App.viewStates"}}
"""