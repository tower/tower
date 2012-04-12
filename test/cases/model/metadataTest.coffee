user = null

describe 'Tower.Model.Metadata', ->
  test '.name', ->
    assert.equal App.User.metadata().name, "user"
    
  test '.namePlural', ->
    assert.equal App.User.metadata().namePlural, "users"
    
  test '.baseClass', ->
    assert.equal App.User.baseClass(), App.User
    
  test '.toParam', ->
    assert.equal App.User.toParam(), "users"
    assert.equal Tower.Model.toParam(), undefined
    
  test '.toKey', ->
    assert.equal App.User.toKey(), "user"
    
  test '.metadata', ->
    metadata = _.extend {}, App.User.metadata()
    delete metadata.store
    
    assert.equal metadata.name,                 'user'
    assert.equal metadata.namePlural,           'users'
    assert.equal metadata.className,            'User'
    assert.equal metadata.classNamePlural,      'Users'
    assert.equal metadata.paramName,            'user'
    assert.equal metadata.paramNamePlural,      'users'
    assert.equal metadata.modelName,            'App.User'
    assert.equal metadata.controllerName,       'App.UsersController'
  
  describe 'instance', ->
    beforeEach ->
      user = new App.User
    
    test '#toLabel', ->
      assert.equal user.toLabel(), "User"
      
    test '#metadata', ->
      metadata = _.extend {}, user.metadata()
      delete metadata.store
      
      assert.equal metadata.name,                 'user'
      assert.equal metadata.namePlural,           'users'
      assert.equal metadata.className,            'User'
      assert.equal metadata.classNamePlural,      'Users'
      assert.equal metadata.paramName,            'user'
      assert.equal metadata.paramNamePlural,      'users'
      assert.equal metadata.modelName,            'App.User'
      assert.equal metadata.controllerName,       'App.UsersController'