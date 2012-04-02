require '../../config'

user = null

describe 'Tower.Model.Metadata', ->
  test '.resourceName', ->
    assert.equal App.User.metadata().name, "user"
    
  test '.collectionName', ->
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
    assert.deepEqual metadata,
      name:                 'user'
      namePlural:           'users'
      className:            'User'
      classNamePlural:      'Users'
      paramName:            'user'
      paramNamePlural:      'users'
      modelName:            'App.User'
      controllerName:       'App.UsersController'
  
  describe 'instance', ->
    beforeEach ->
      user = new App.User
    
    test '#className', ->
      assert.equal user.className(), "User"
      
    test '#toLabel', ->
      assert.equal user.toLabel(), "User"
      
    test '#metadata', ->
      metadata = _.extend {}, user.metadata()
      delete metadata.store
      assert.deepEqual metadata,
        name:                 'user'
        namePlural:           'users'
        className:            'User'
        classNamePlural:      'Users'
        paramName:            'user'
        paramNamePlural:      'users'
        modelName:            'App.User'
        controllerName:       'App.UsersController'