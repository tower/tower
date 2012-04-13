view = null
user = null

describe 'Tower.View meta', ->
  beforeEach ->
    view = new Tower.View
    
  test '#metaTag', ->
    template = ->
      metaTag "description", "A meta tag"
    
    view.render template: template, (error, result) ->
      assert.equal result, """
<meta name="description" content="A meta tag" />

"""
  
  test 'appleViewportMetaTag', ->
    template = ->
      appleViewportMetaTag width: "device-width", max: 1, scalable: false
    
    view.render template: template, (error, result) ->
      assert.equal result, """
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

"""

  test 'openGraphMetaTags', ->
    template = ->
      openGraphMetaTags title: "Tower.js", type: "site"
    
    view.render template: template, (error, result) ->
      assert.equal result, """
<meta property="og:title" content="Tower.js" />
<meta property="og:type" content="site" />

"""
