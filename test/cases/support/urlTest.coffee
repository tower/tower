require '../../config'

describe 'Tower.Support.Url', ->
  test 'urlFor("something")', ->
    url = Tower.urlFor("something")
    assert.equal url, "/something"
    
  test 'urlFor("/something")', ->
    url = Tower.urlFor("/something")
    assert.equal url, "/something"
    
  test 'urlFor("/something", action: "new")', ->
    url = Tower.urlFor("/something", action: "new")
    assert.equal url, "/something/new"
    
  test 'urlFor("/something/longer")', ->
    url = Tower.urlFor("/something/longer")
    assert.equal url, "/something/longer"
    
  test 'urlFor(App.User)', ->
    url = Tower.urlFor(App.User)
    assert.equal url, "/users"
    
  test 'urlFor(post, App.Comment)', ->
    url = Tower.urlFor(new App.Post(id: 10), App.Comment)
    assert.equal url, "/posts/10/comments"
    
  test 'urlFor(post, comment)', ->
    url = Tower.urlFor(new App.Post(id: 10), new App.Comment(id: 20))
    assert.equal url, "/posts/10/comments/20"
    
  test 'urlFor("admin", post, comment)', ->
    url = Tower.urlFor("admin", new App.Post(id: 10), new App.Comment(id: 20))
    assert.equal url, "/admin/posts/10/comments/20"
    
  test 'urlFor(post, comment, action: "edit")', ->
    url = Tower.urlFor(new App.Post(id: 10), new App.Comment(id: 20), action: "edit")
    assert.equal url, "/posts/10/comments/20/edit"