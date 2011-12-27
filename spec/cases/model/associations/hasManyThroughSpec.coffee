describe 'hasMany through', ->
  post    = null
  comment = null
  
  beforeEach ->
    post = Post.create(title: "Post with comment")
    
  it 'should create', ->
    expect(post.comments() instanceof Tower.Model.Relation.HasMany.Scope).toBeTruthy()
    expect(post.commenters() instanceof Tower.Model.Relation.HasManyThrough.Scope).toBeTruthy()
    #console.log post.commenters()
    
  describe 'polymorphism', ->
    beforeEach ->
      Post.deleteAll()
      post = Post.create(title: "Post with comment")
    
    it 'should define polymorphic relation', ->
      relation = Post.relations().comments
      expect(relation.polymorphic).toBeTruthy()
      expect(relation.as).toEqual "commentable"
      expect(relation.type).toEqual "TowerSpecApp.Comment"
      