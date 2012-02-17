require '../../config'

describe 'Tower.Support.String', ->
  test 'urlFor("something")', ->
    url = Tower.urlFor("something")
    expect(url).toEqual "/something"
    
  test 'urlFor("/something")', ->
    url = Tower.urlFor("/something")
    expect(url).toEqual "/something"
    
  test 'urlFor("/something", action: "new")', ->
    url = Tower.urlFor("/something", action: "new")
    expect(url).toEqual "/something/new"
    
  test 'urlFor("/something/longer")', ->
    url = Tower.urlFor("/something/longer")
    expect(url).toEqual "/something/longer"
    
  test 'urlFor(User)', ->
    url = Tower.urlFor(User)
    expect(url).toEqual "/users"
    
  test 'urlFor(post, Comment)', ->
    url = Tower.urlFor(new Post(id: 10), Comment)
    expect(url).toEqual "/posts/10/comments"
    
  test 'urlFor(post, comment)', ->
    url = Tower.urlFor(new Post(id: 10), new Comment(id: 20))
    expect(url).toEqual "/posts/10/comments/20"
    
  test 'urlFor("admin", post, comment)', ->
    url = Tower.urlFor("admin", new Post(id: 10), new Comment(id: 20))
    expect(url).toEqual "/admin/posts/10/comments/20"
    
  test 'urlFor(post, comment, action: "edit")', ->
    url = Tower.urlFor(new Post(id: 10), new Comment(id: 20), action: "edit")
    expect(url).toEqual "/posts/10/comments/20/edit"