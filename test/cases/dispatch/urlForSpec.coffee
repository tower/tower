require '../../config'

post              = null
defaultUrlOptions = null

describe 'urlFor', ->
  beforeEach ->
    post = new Post(id: 10)
    
    defaultUrlOptions = 
      onlyPath:      true, 
      params:        {}
      trailingSlash: false, 
      host:          "example.com"
  
  test 'urlFor(Post, onlyPath: false)', ->
    path = Tower.urlFor(Post, _.extend defaultUrlOptions, onlyPath: false)
    
    expect(path).toEqual "http://example.com/posts"
    
  test 'urlFor(Post, onlyPath: false, user: "lance", password: "pollard")', ->
    path = Tower.urlFor(Post, _.extend defaultUrlOptions, onlyPath: false, user: "lance", password: "pollard")

    expect(path).toEqual "http://lance:pollard@example.com/posts"
    
  test 'urlFor(Post)', ->
    path = Tower.urlFor(Post, defaultUrlOptions)

    expect(path).toEqual "/posts"

  test 'urlFor(post)', ->
    path = Tower.urlFor(post, defaultUrlOptions)
    
    expect(path).toEqual "/posts/10"
    
  test 'urlFor("admin", post)', ->
    path = Tower.urlFor("admin", post, defaultUrlOptions)

    expect(path).toEqual "/admin/posts/10"
    
  test 'urlFor(post, likeCount: 10)', ->
    path = Tower.urlFor(post, _.extend defaultUrlOptions, params: likeCount: 10)

    expect(path).toEqual "/posts/10?likeCount=10"
    
  test 'urlFor(post, likeCount: ">=": 10)', ->
    path = Tower.urlFor(post, _.extend defaultUrlOptions, params: likeCount: ">=": 10)

    expect(path).toEqual "/posts/10?likeCount=10..n"
    
  test 'urlFor(post, likeCount: ">=": 10, "<=": 100)', ->
    path = Tower.urlFor(post, _.extend defaultUrlOptions, params: likeCount: ">=": 10, "<=": 100)

    expect(path).toEqual "/posts/10?likeCount=10..100"
    
  test 'urlFor(post, likeCount: ">=": 10, "<=": 100)', ->
    path = Tower.urlFor(post, _.extend defaultUrlOptions, params: likeCount: ">=": 10, "<=": 100)

    expect(path).toEqual "/posts/10?likeCount=10..100"
    
  test 'urlFor(post, title: "Hello World", likeCount: ">=": 10, "<=": 100)', ->
    path = Tower.urlFor(post, _.extend defaultUrlOptions, params: title: "Hello World", likeCount: ">=": 10, "<=": 100)

    expect(path).toEqual "/posts/10?likeCount=10..100&title=Hello+World"
    
  test 'urlFor(post, [{title: /Rails/}, {likeCount: ">=": 10}])', ->
    #expect(path).toEqual "/posts/10?likeCount[1]=10..n&title[0]=/Rails/"