require '../config'

scope   = null
user    = null
post    = null
comment = null

describe 'Tower.Model.Relation.Scope', ->
  beforeEach ->
    User.store(new Tower.Store.Memory(name: "users", type: "User"))
    Post.store(new Tower.Store.Memory(name: "posts", type: "Post"))
    Comment.store(new Tower.Store.Memory(name: "comments", type: "Comment"))
    user    = new User(id: 10)
    scope   = user.posts()
    
  afterEach ->
    scope = null
  
  describe 'hasMany#find', ->
    test '`1, 2, 3`', ->
      spyOn scope.store, "find"
      scope.find 1, 2, 3
      
      expect(scope.store.find).toHaveBeenCalledWith {userId: 10, id: $in: [1, 2, 3]}, {}, undefined
      
    test '`[1, 2, 3]`', ->
      spyOn scope.store, "find"
      scope.find [1, 2, 3]
      
      expect(scope.store.find).toHaveBeenCalledWith {userId: 10, id: $in: [1, 2, 3]}, {}, undefined
  
  describe 'hasMany', ->
    beforeEach ->
      post    = Post.create(id: 10)
      user    = User.create(id: 20)
      
    describe '#create', ->
      test 'no params', ->
        comment = post.comments().create()
      
        expect(comment.get('commentableId')).toEqual 10
        expect(comment.get('commentableType')).toEqual "Post"
      
      test 'belongsTo record as parameter', ->
        comment = post.comments().create(commenter: user)
      
        expect(comment.get('commentableId')).toEqual 10
        expect(comment.get('commentableType')).toEqual "Post"
        expect(comment.get('commenterId')).toEqual 20
      
      test 'belongsTo record id as parameter', ->
        comment = post.comments().create(commenterId: user.id)
      
        expect(comment.get('commentableId')).toEqual 10
        expect(comment.get('commentableType')).toEqual "Post"
        expect(comment.get('commenterId')).toEqual 20
      
    describe '#find', ->
      beforeEach ->
        n = 3
        while n > 0
          post.comments().create(commenter: user)
          n -= 1
      
      test '#count', ->
        expect(post.comments().count()).toEqual 3
      
      test 'find by id', ->
        scope = post.comments()
        spyOn scope.store, "find"
        scope.find 1, 2
        
        expect(scope.store.find).toHaveBeenCalledWith { commentableId : 10, commentableType : 'Post', id : { $in : [ 1, 2 ] } }, {  }, undefined
      
    describe 'hasMany through', ->
      beforeEach ->
        n = 3
        while n > 0
          post.comments().create(commenter: user)
          n -= 1
      
      test 'find', ->
        scope = post.commenters()
        spyOn scope.store, "all"
        scope.all()
        
        # want: { id: $in: [commentUserId1, commentUserId2, ...] }
        expect(scope.store.all).toHaveBeenCalledWith {}#{ pageId : 10 }, {  }, undefined
        
        console.log post.commenters().all()
      
###      
  describe 'hasMany :through', ->
    beforeEach ->
      post    = Post.create(id: 10)
      user    = User.create(id: 10)
      console.log post.comments()
      comment = post.comments().create(userId: user.id)
      scope   = post.commenters()
      
    test 'commenters through comments', ->
      console.log comment
###