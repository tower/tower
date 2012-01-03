describe 'Tower.Model', ->
  beforeEach ->
    User.store(new Tower.Store.Memory(name: "users", className: "TowerSpecApp.User"))
      
  describe 'associations', ->
    beforeEach ->
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
      require '../config'

      describe 'Tower.Model', ->
        beforeEach ->
          User.store(new Tower.Store.Memory(name: "users", className: "TowerSpecApp.User"))

  describe 'creating associations', ->
    beforeEach ->
      User.deleteAll()
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