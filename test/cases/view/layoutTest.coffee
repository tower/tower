fs          = require "fs"
controller  = null
view        = null
user        = null

describe 'Tower.View', ->
  beforeEach ->
    view = new Tower.View

  test 'layout', ->
    template = ->
      doctype 5
      html ->
        head ->
          meta charset: "utf-8"
          title "Tower.js - Full Stack JavaScript Framework for Node.js and the Browser"
        body role: "application", ->

    view.render template: template, (error, result) ->
      assert.equal result, """
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Tower.js - Full Stack JavaScript Framework for Node.js and the Browser</title>
  </head>
  <body role="application">
  </body>
</html>

"""

  test 'yields', ->

describe 'Tower.View eco template', ->
  beforeEach ->
    view = new Tower.View

  test 'eco layout', ->
    out_put = fs.readFileSync __dirname + "/out_put.html", "utf-8"
    view.render {type: "eco", template: "eco_layout"}, (error, result) ->
      assert.equal result, out_put