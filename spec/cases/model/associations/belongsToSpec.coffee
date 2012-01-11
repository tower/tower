describe 'belongsTo', ->
  post    = null
  comment = null
  user    = null
  
  describe 'polymorphism', ->
    beforeEach ->
      Post.deleteAll()
      User.deleteAll()
      post = Post.create(title: "Post with comment")
      user = User.create()
    
    it 'should build polymorphic relation', ->
      comment = post.comments().build()
      expect(comment.attributes.hasOwnProperty("pageId")).toBeFalsy()
      expect(comment.attributes.hasOwnProperty("postId")).toBeFalsy()
      expect(comment.attributes.hasOwnProperty("commentableId")).toBeTruthy()
      expect(comment.attributes.hasOwnProperty("commentableType")).toBeTruthy()
      expect(comment.attributes.commentableType).toEqual "Post"
      
    it 'should create polymorphic relation', ->
      comment = post.comments().create(commenterId: user.id)
      expect(comment.attributes.hasOwnProperty("pageId")).toBeFalsy()
      expect(comment.attributes.hasOwnProperty("postId")).toBeFalsy()
      expect(comment.attributes.hasOwnProperty("commentableId")).toBeTruthy()
      expect(comment.attributes.hasOwnProperty("commentableType")).toBeTruthy()
      expect(comment.attributes.commentableType).toEqual "Post"
      expect(comment.attributes.hasOwnProperty("commenterId")).toBeTruthy()