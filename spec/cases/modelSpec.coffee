require '../config'

scope     = null
criteria  = null

describe 'Tower.Model', ->
  beforeEach ->
    User.store(new Tower.Store.Memory(name: "users", className: "TowerSpecApp.User"))

describe 'Tower.Model.Callbacks', ->
  beforeEach ->
    User.store(new Tower.Store.Memory(name: "users", type: "User"))
    scope = User.scoped()

  afterEach ->
    scope = null

  describe '#before', ->
    test 'existence', ->
      expect(User.callbacks().create.before[0].method).toEqual 'setCreatedAt'

    test 'called', ->
      user = User.create(firstName: "Lance")
      expect(user.get('createdAt')).toEqual new Date

describe 'Tower.Model.Criteria', ->
  beforeEach ->
    criteria = new Tower.Model.Criteria
    
  afterEach ->
    criteria = null
  
  describe '#where', ->
    it '`$in: [1, 2, 3]`', ->
      criteria.where id: $in: [1, 2, 3]
      
      expect(criteria.query).toEqual id: { '$in': [1, 2, 3] }
      expect(criteria.options).toEqual {}
      
    it '2 parts: `$in: [1, 2, 3], $in: [4, 5, 6]`', ->
      criteria.where id: $in: [1, 2, 3]
      criteria.where id: $in: [4, 5, 6]
      
      expect(criteria.query).toEqual id: { '$in': [1, 2, 3, 4, 5, 6] }
      expect(criteria.options).toEqual {}
      
    it '2 different keys: `$in: [1, 2, 3], $nin: [4, 5, 6]`', ->
      criteria.where id: $in: [1, 2, 3]
      criteria.where id: $nin: [4, 5, 6]
      
      expect(criteria.query).toEqual id: { '$in': [1, 2, 3], '$nin': [4, 5, 6] }
      expect(criteria.options).toEqual {}
      
    test 'before: `id: $in: [1, 2, 3]`, after: `id: 10`', ->
      criteria.where id: $in: [1, 2, 3]
      criteria.where id: 10
      
      expect(criteria.query).toEqual id: 10
      expect(criteria.options).toEqual {}
      
    test 'before: `id: 10`, after: `id: $in: [1, 2, 3]`, ', ->  
      criteria.where id: 10
      criteria.where id: $in: [1, 2, 3]
      
      expect(criteria.query).toEqual id: { '$in': [1, 2, 3] }
      expect(criteria.options).toEqual {}
      
  describe '#order', ->
    test 'sort by one property', ->
      criteria.order "firstName", "asc"
      
      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { sort : [[ 'firstName', 'asc' ]] }
  
    test 'sort by two properties', ->
      criteria.order "firstName", "asc"
      criteria.order "lastName", "desc"
      
      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { sort : [[ 'firstName', 'asc' ], [ 'lastName', 'desc' ]] }

    test 'sort default equals `asc`', ->
      criteria.order "firstName"

      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { sort : [[ 'firstName', 'asc' ]] }
      
  describe '#limit', ->
    it 'should limit', ->
      criteria.limit 20
      
      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { limit : 20 }
      
    it 'should override limit', ->
      criteria.limit 20
      criteria.limit 100

      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { limit : 100 }
      
  describe '#offset', ->
    it 'should offset', ->
      criteria.offset 20
      
      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { offset : 20 }
      
    it 'should override offset', ->
      criteria.offset 20
      criteria.offset 100

      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { offset : 100 }
      
  describe '#paginate', ->
    test 'pagination', ->
      criteria.paginate perPage: 20, page: 20
      
      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { limit : 20, offset : 380 }
      
    test 'override pagination', ->
      criteria.paginate perPage: 20, page: 20
      criteria.paginate perPage: 20, page: 2

      expect(criteria.query).toEqual {}
      expect(criteria.options).toEqual { limit : 20, offset : 20 }
      
  describe 'integrated queries', ->
    test 'query, sort, and pagination', ->
      criteria.where id: $in: [1, 2, 3]
      criteria.where id: $in: [4, 5, 6]
      criteria.where name: "!~": /[a-z]/
      criteria.where name: "=~": /[0-9]/
      criteria.order "name", "asc"
      criteria.paginate perPage: 20, page: 2
      
      expect(criteria.query).toEqual { id: { '$in': [1, 2, 3, 4, 5, 6] }, name: { '!~': /[a-z]/, '=~': /[0-9]/ } }
      expect(criteria.options).toEqual { limit : 20, offset : 20, sort: [["name", "asc"]] }
      
  test '#clone', ->
    expect(criteria.clone()).toBeTruthy()
    
  test '#allIn', ->

describe 'Tower.Model.Field', ->
  beforeEach ->
    spec.resetUserStore()
    @user = new User(firstName: 'Terminator', id: 1)
    
  it 'should track attribute changes', ->
    expect(@user.changes).toEqual {}
    expect(@user.attributeChanged("firstName")).toEqual false
    
    @user.firstName = "T1000"
    
    expect(@user.changes).toEqual firstName: ["Terminator", "T1000"]
    
    @user.firstName = "Smith"
    
    expect(@user.changes).toEqual firstName: ["Terminator", "Smith"]
    
    expect(@user.attributeChanged("firstName")).toEqual true
    expect(@user.attributeWas("firstName")).toEqual "Terminator"
    expect(@user.attributeChange("firstName")).toEqual "Smith"
    
describe 'Tower.Model.Hierarchical', ->
  beforeEach ->
    spec.resetUserStore()
    
  test 'build tree', ->
    parent  = Category.create()
    childA  = parent.children().create()
    childB  = parent.children().create()
    
    expect(parent.parentId).toEqual undefined
    expect(childA.parentId).toEqual 0
    expect(childB.parentId).toEqual 0
    expect(parent.children().all()).toEqual [childA, childB]
    
    #console.log parent
    #console.log childA
    #console.log childB
    #console.log parent.children.all()
    #
    #console.log childB.parent

describe 'Tower.Model.Inheritance', ->
  beforeEach ->
    spec.resetUserStore()
    User.create(firstName: 'Terminator', id: 1, createdAt: new Date())
    User.create(firstName: 'Terminator 2', id: 2, createdAt: require('moment')().subtract('days', 20))
    User.create(firstName: 'Terminator 3', id: 3, createdAt: new Date())
  
  it 'should have scoped by type', ->
    expect(User.thisWeek.all().length).toEqual 2
    
  it 'should have a default', ->
    expect((new User).createdAt).toEqual new Date

describe 'Tower.Model.Relation', ->
  describe 'associations', ->
    beforeEach ->
      spec.resetUserStore()
      @user = User.create(id: 1, firstName: "Lance")
      @post = Page.create(id: 1, title: "First Post", userId: @user.id)
      
    afterEach ->
      User.deleteAll()
      Page.deleteAll()
      
    it 'should associate', ->
      posts = @user.posts().where(title: "=~": "First").all()
      expect(posts.length).toEqual 1
      
      posts = @user.posts().where(title: "=~": "first").all()
      expect(posts.length).toEqual 0

  describe 'creating associations', ->
    beforeEach ->
      spec.resetUserStore()
      @user = User.create(firstName: 'Terminator', id: 1)

    it 'should create a post from a user', ->
      post = @user.posts().create()
      expect(post.userId).toEqual 1
      expect(post.title).toBeFalsy()

      post = @user.posts().create(title: "A Post!")
      expect(post.userId).toEqual 1
      expect(post.title).toEqual "A Post!"

      expect(Page.count()).toEqual 2
      expect(@user.postIds).toEqual [0, 1]

      @user.updateAttributes "$pull": "postIds": [0]
      expect(@user.postIds).toEqual [1]

    it 'should build a post', ->
      post = @user.posts().build()
      expect(post.userId).toEqual 1
      expect(post.id).toBeFalsy()

    it 'should build a user from a post', ->
      post = Page.create(title: "Something")
      user = post.buildUser(firstName: "Santa")

      expect(user.firstName).toEqual "Santa"
      expect(user.postIds).toEqual [1]
      expect(user.id).toBeFalsy()

    it 'should create a user from a post', ->
      post = Page.create(title: "Something")
      user = post.createUser(firstName: "Santa")

      expect(user.firstName).toEqual "Santa"
      expect(user.postIds).toEqual [1]
      expect(user.id).toEqual 0

      expect(post.user()).toEqual user
  
  describe 'BelongsTo', ->
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
        
  describe 'HasManyThrough', ->
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
        
describe 'Tower.Model.Persistence', ->
  describe 'updating', ->
    beforeEach ->
      spec.resetUserStore()
      User.deleteAll()
      Page.deleteAll()
      Post.deleteAll()
      
    it 'should $push values if the attribute is defined as an array when I updateAttributes', ->
      user = User.create(firstName: "music")
      expect(user.postIds.length).toEqual 0
      user.posts().create(title: "A Post")
      expect(user.postIds.length).toEqual 1
      user.updateAttributes postIds: 2
      expect(user.postIds.length).toEqual 2

describe 'Tower.Model.Scope', ->
  beforeEach ->
    spec.resetUserStore()
    User.store(new Tower.Store.Memory(name: "users", type: "User"))
    scope = User.scoped()
    @user = User.create(id: 1, firstName: "Lance")
    User.create(id: 2, firstName: "Dane")

  afterEach ->
    User.deleteAll()
    scope = null
    
  it 'should have a getter', ->
    expect(@user.firstName).toEqual "Lance"
    
  it 'should have where scope', ->
    user = User.where(firstName: "Lance").first()
    
    expect(user.firstName).toEqual "Lance"
    
    users = User.where(firstName: "=~": "c").all()
    expect(users.length).toEqual 1
    expect(users[0].firstName).toEqual "Lance"
    
    users = User.where(firstName: "=~": "a").order("firstName").all()
    expect(users.length).toEqual 2
    expect(users[0].firstName).toEqual "Dane"
    
    users = User.where(firstName: "=~": "a").order("firstName", "desc").all()
    expect(users.length).toEqual 2
    expect(users[0].firstName).toEqual "Lance"
  
  it 'should have named scopes', ->  
    User.create(id: 3, firstName: "Baldwin")
    
    expect(User.byBaldwin.first().firstName).toEqual "Baldwin"

  describe '#find', ->
    test '`1, 2, 3`', ->
      spyOn scope.store, "find"
      scope.find 1, 2, 3
      
      expect(scope.store.find).toHaveBeenCalledWith {id: $in: [1, 2, 3]}, {}, undefined
      
    test '`[1, 2, 3]`', ->
      spyOn scope.store, "find"
      scope.find [1, 2, 3]
      
      expect(scope.store.find).toHaveBeenCalledWith {id: $in: [1, 2, 3]}, {}, undefined
      
    test '`[1, 2, 3], callback`', ->
      callback = ->
      
      spyOn scope.store, "find"
      scope.find [1, 2, 3], callback
      
      expect(scope.store.find).toHaveBeenCalledWith {id: $in: [1, 2, 3]}, {}, callback
      
    test 'where(id: $in: [1, 2, 3]).find(1) should only pass id: $in: [1]', ->
      spyOn scope.store, "find"
      scope.where(id: $in: [1, 2, 3]).find(1)
      
      expect(scope.store.find).toHaveBeenCalledWith {id: $in: [1]}, {}, undefined
      
  describe '#update', ->
    test '`1, 2, 3`', ->
      spyOn scope.store, "update"
      scope.update 1, 2, 3, {name: "Lance"}, instantiate: false
      
      expect(scope.store.update).toHaveBeenCalledWith { name : 'Lance' }, { id : { $in : [ 1, 2, 3 ] } }, {}, undefined 
      
    test '`[1, 2, 3]`', ->
      spyOn scope.store, "update"
      scope.update 1, 2, 3, {name: "Lance"}, instantiate: false

      expect(scope.store.update).toHaveBeenCalledWith { name : 'Lance' }, { id : { $in : [ 1, 2, 3 ] } }, {}, undefined 
      
  describe '#delete', ->
    test '`1, 2, 3`', ->
      spyOn scope.store, "delete"
      scope.delete 1, 2, 3, instantiate: false
      
      expect(scope.store.delete).toHaveBeenCalledWith { id : { $in : [ 1, 2, 3 ] } }, {}, undefined 
      
    test '`[1, 2, 3]`', ->
      spyOn scope.store, "delete"
      scope.delete 1, 2, 3, instantiate: false
      
      expect(scope.store.delete).toHaveBeenCalledWith  { id : { $in : [ 1, 2, 3 ] } }, {}, undefined 
      
    test 'query + ids', ->
      spyOn scope.store, "delete"
      scope.where(name: "John").delete 1, 2, 3, instantiate: false
      
      expect(scope.store.delete).toHaveBeenCalledWith  { name: "John", id : { $in : [ 1, 2, 3 ] } }, {}, undefined
      
  describe '#create', ->
    test 'create(name: "Lance")', ->
      spyOn scope.store, "create"
      scope.create(name: "Lance")
      
      expect(scope.store.create).toHaveBeenCalledWith { name: "Lance" }, {}, undefined
      
    test 'where(name: "Lance").create()', ->
      spyOn scope.store, "create"
      scope.where(name: "Lance").create()
      
      expect(scope.store.create).toHaveBeenCalledWith { name: "Lance" }, {}, undefined
      
    test 'create with an `id`', ->
      spyOn scope.store, "create"
      scope.create id: "something"

      expect(scope.store.create).toHaveBeenCalledWith { id: "something" }, {}, undefined
      
  test '#clone', ->
    clone = scope.where(name: "Lance")
    clone2 = clone.where(email: "example@gmail.com")
    
    expect(clone.criteria.query).toNotEqual scope.criteria.query
    expect(clone2.criteria.query).toEqual name: "Lance", email: "example@gmail.com"
    expect(clone.criteria.query).toEqual name: "Lance"
    expect(scope.criteria.query).toEqual {}

describe 'Tower.Model.Serialization', ->
  beforeEach ->
    spec.resetUserStore()

    @user = new User(firstName: 'Terminator', id: 1)
    
  it 'should serialize to JSON', ->
    expected = '{"firstName":"Terminator","id":1,"createdAt":'
    expected += JSON.stringify(new Date)
    expected += ',"likes":0,"tags":[],"postIds":[]}'
    expect(@user.toJSON()).toEqual expected
    
  it 'should unmarshall from JSON', ->
    user = User.fromJSON('{"firstName":"Terminator","id":1}')[0]
    expect(user).toEqual(@user)

describe 'Tower.Model.Validation', ->
  beforeEach ->
    spec.resetUserStore()
    @user = new User(id: 1)
  
  it 'should be invalid', ->
    expect(@user.validate()).toEqual false
    
    expect(@user.errors).toEqual({ 'firstName' : ["firstName can't be blank"] })
    
    @user.firstName = "Joe"
    
    expect(@user.validate()).toEqual true
    expect(@user.errors).toEqual []
    
    @user.firstName = null
    
    expect(@user.validate()).toEqual false
    expect(@user.errors).toEqual({ 'firstName' : ["firstName can't be blank"] })
  
  it 'should validate from attribute definition', ->
    page = new Page(title: "A Page")
    
    expect(page.validate()).toEqual false
    expect(page.errors).toEqual { 'rating': ['rating must be a minimum of 0', 'rating must be a maximum of 10' ] }
    
    page.rating = 10
    
    expect(page.validate()).toEqual true
    expect(page.errors).toEqual []

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