describe 'Tower.Support.Url', ->
  urlFor = Tower.urlFor
  
  test 'urlFor("something")', ->
    url = urlFor("something")
    assert.equal url, "/something"
    
  test 'urlFor("/something")', ->
    url = urlFor("/something")
    assert.equal url, "/something"
    
  test 'urlFor("/something", action: "new")', ->
    url = urlFor("/something", action: "new")
    assert.equal url, "/something/new"
    
  test 'urlFor("/something/longer")', ->
    url = urlFor("/something/longer")
    assert.equal url, "/something/longer"
    
  test 'urlFor(controller: "custom", action: "new")', ->
    url = urlFor(controller: "custom", action: "new")
    assert.equal url, "/custom/new"
    
  test 'urlFor(App.User)', ->
    url = urlFor(App.User)
    assert.equal url, "/users"
    
  test 'urlFor(post, App.Comment)', ->
    url = urlFor(new App.Post(id: 10), App.Comment)
    assert.equal url, "/posts/10/comments"
    
  test 'urlFor(post, comment)', ->
    url = urlFor(new App.Post(id: 10), new App.Comment(id: 20))
    assert.equal url, "/posts/10/comments/20"
    
  test 'urlFor("admin", post, comment)', ->
    url = urlFor("admin", new App.Post(id: 10), new App.Comment(id: 20))
    assert.equal url, "/admin/posts/10/comments/20"
    
  test 'urlFor(post, comment, action: "edit")', ->
    url = urlFor(new App.Post(id: 10), new App.Comment(id: 20), action: "edit")
    assert.equal url, "/posts/10/comments/20/edit"
    
  describe 'named routes', ->
    test 'find route', ->
      route = Tower.Route.find('login')
      assert.equal route.name, 'login'
      
    test 'urlFor(route: "login")', ->
      url = urlFor(route: 'login')
      assert.equal url, "/sign-in"
      
    #test 'urlFor(modelThatWasRenamed)', ->
    #  url = urlFor(route: 'login')
    #  assert.equal url, "/sign-in"
      
  describe 'urlFor with params', ->
    post = null
    
    beforeEach ->
      post = App.Post.create(id: 10)
      
    describe 'strings', ->
      test 'urlFor(post, params: title: "Node")', ->
        url = urlFor(post, params: title: "Node")
        assert.equal url, "/posts/10?title=Node"
      
      test 'urlFor(post, params: title: /^a-z/)', ->
        url = urlFor(post, params: title: /^a-z/)
        assert.equal url, "/posts/10?title=/^a-z/"
    
    describe 'numbers', ->
      test 'urlFor(post, params: likes: 10)', ->
        url = urlFor(post, params: likes: 10)
        assert.equal url, "/posts/10?likes=10"
        
      test 'urlFor(post, params: likes: ">=": 10)', ->
        url = urlFor(post, params: likes: '>=': 10)
        assert.equal url, "/posts/10?likes=10..n"
        
      test 'urlFor(post, params: likes: "<=": 20)', ->
        url = urlFor(post, params: likes: '<=': 20)
        assert.equal url, "/posts/10?likes=n..20"
        
      test 'urlFor(post, params: likes: ">=": 10, "<=": 20)', ->
        url = urlFor(post, params: likes: '>=': 10, '<=': 20)
        assert.equal url, "/posts/10?likes=10..20"
        
    describe 'dates', ->
      test 'urlFor(post, params: createdAt: _("Dec 25, 2011").toDate())', ->
        url = urlFor(post, params: createdAt: _("Dec 25, 2011").toDate())
        assert.equal url, "/posts/10?createdAt=2011-12-25"

      test 'urlFor(post, params: createdAt: ">=": _("Dec 25, 2011").toDate())', ->
        url = urlFor(post, params: createdAt: '>=': _("Dec 25, 2011").toDate())
        assert.equal url, "/posts/10?createdAt=2011-12-25..t"

      test 'urlFor(post, params: createdAt: "<=": _("Dec 25, 2011").toDate())', ->
        url = urlFor(post, params: createdAt: '<=': _("Dec 25, 2011").toDate())
        assert.equal url, "/posts/10?createdAt=t..2011-12-25"

      test 'urlFor(post, params: createdAt: ">=": _("Dec 25, 2011").toDate(), "<=": _("Dec 25, 2012").toDate())', ->
        url = urlFor(post, params: createdAt: '>=': _("Dec 25, 2011").toDate(), '<=': _("Dec 25, 2012").toDate())
        assert.equal url, "/posts/10?createdAt=2011-12-25..2012-12-25"
        
    test 'date, number, and string', ->
      params =
        createdAt: 
          '>=': _("Dec 25, 2011").toDate()
          '<=': _("Dec 25, 2012").toDate()
        likes:
          '>=': 10
          '<=': 20
        title: "Node"
        
      url = urlFor(post, params: params)
      assert.equal url, "/posts/10?createdAt=2011-12-25..2012-12-25&likes=10..20&title=Node"
  
  test 'trailing slash'