require '../../config'

controller  = null
view        = null
user        = null

describe 'Tower.View', ->
  beforeEach ->
    view = new Tower.View
    Tower.View.cache = {}

  afterEach ->
    Tower.View.cache = {}
    
  test 'partial', ->
    Tower.View.cache["app/views/shared/_meta"] = """
      meta charset: "utf-8"
      title "Tower.js - Full Stack JavaScript Framework for Node.js and the Browser"
    """
    
    template = ->
      doctype 5
      html ->
        head ->
          partial "shared/meta"
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
  
  test "partial with collection", ->
    Tower.View.cache["app/views/posts/_item"] = """
      li class: "post", -> post.get("title")
    """
    
    posts = []
    posts.push new App.Post(title: "First Post")
    posts.push new App.Post(title: "Second Post")
    
    template = ->
      ul class: "posts", ->
        partial "posts/item", collection: @posts, as: "post"
        #for post in @posts
        #  li class: "post", -> post.get("title")
        
    view.render template: template, locals: posts: posts, (error, result) ->
      assert.equal result, """
<ul class="posts">
  <li class="post">
    First Post
  </li>
  <li class="post">
    Second Post
  </li>
</ul>

"""
  
  test "partial with locals", ->
    Tower.View.cache["app/views/posts/_item"] = """
      li class: "post", -> post.get("title")
    """
    
    post = new App.Post(title: "First Post")
    
    template = ->
      ul class: "posts", ->
        partial "posts/item", locals: post: @post
        #for post in @posts
        #  li class: "post", -> post.get("title")
        
    view.render template: template, locals: post: post, (error, result) ->
      assert.equal result, """
<ul class="posts">
  <li class="post">
    First Post
  </li>
</ul>

"""

  test "partials within partials with locals", ->
    Tower.View.cache["app/views/posts/_item"] = """
      li class: "post", ->
        partial "posts/header", locals: post: post
    """
    
    Tower.View.cache["app/views/posts/_header"] = """
      header ->
        h1 post.get("title")
    """
    
    post = new App.Post(title: "First Post")
    
    template = ->
      ul class: "posts", ->
        partial "posts/item", locals: post: @post
        #for post in @posts
        #  li class: "post", -> post.get("title")
        
    view.render template: template, locals: post: post, (error, result) ->
      assert.equal result, """
<ul class="posts">
  <li class="post">
    <header>
      <h1>First Post</h1>
    </header>
  </li>
</ul>

"""
