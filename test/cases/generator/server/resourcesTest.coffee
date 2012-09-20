generator       = null
sourceRoot      = null
destinationRoot = null
File            = require('pathfinder').File
fs              = require 'fs'
wrench          = require 'wrench'
cakefileDestination = null

describe 'Tower.GeneratorResources', ->
  beforeEach ->
    wrench.rmdirSyncRecursive("#{process.cwd()}/test/tmp", true)
    generator   = new Tower.Generator(silent: true)
    
  test '#generateRandom("hex")', ->
    assert.match generator.generateRandom('hex'), /^\b[0-9a-fA-F]+\b$/
    
  test '#buildRelation', ->
    expected  = { name: 'user', type: 'belongsTo', humanName: 'User' }

    assert.deepEqual expected, generator.buildRelation('belongsTo', 'User')
    
  test '#buildModel("user")', ->
    expected  =
      name:                'user'
      namespace:           'App'
      className:           'User'
      classNamePlural:     'Users'
      namespacedClassName: 'App.User'
      namePlural:          'users'
      paramName:           'user'
      paramNamePlural:     'users'
      humanName:           'User'
      attributes:          []
      relations:
        belongsTo: []
        hasOne: []
        hasMany: []
      namespacedDirectory: ''
      viewDirectory:       '/users'
      namespaced:          ''
      
    model = generator.buildModel('user', 'App')
      
    for key, value of expected
      assert.deepEqual value, model[key]
    
  test '#buildModel("camelCase")', ->
    expected  =
      name:                'camelCase'
      namespace:           'App'
      className:           'CamelCase'
      classNamePlural:     'CamelCases'
      namespacedClassName: 'App.CamelCase'
      namePlural:          'camelCases'
      paramName:           'camel-case'
      paramNamePlural:     'camel-cases'
      humanName:           'Camel case'
      attributes:          []
      relations:
        belongsTo: []
        hasOne: []
        hasMany: []
      namespacedDirectory: ''
      viewDirectory:       '/camelCases'
      namespaced:          ''
    
    model = generator.buildModel('camelCase', 'App')
    
    for key, value of expected
      assert.deepEqual value, model[key]
      
  test '#buildController("user")', ->
    expected =
      namespace:  'App'
      className:  'UsersController'
      directory:  ''
      name:       'usersController'
      namespaced: false
    
    controller = generator.buildController('user')
    
    for key, value of expected
      assert.deepEqual value, controller[key]
      
  test '#buildView', ->
    expected =
      namespace: 'user'
      directory: 'users'
    
    view = generator.buildView('user')
    
    for key, value of expected
      assert.deepEqual value, view[key]
      
  describe '#buildAttribute', ->
    test 'name: "title"', ->
      expected =
        name:      'title'
        type:      'String'
        humanName: 'Title'
        fieldType: 'string'
        value:     'A title'
      
      attribute = generator.buildAttribute('title')
      
      for key, value of expected
        assert.deepEqual value, attribute[key]
        
    test 'name: "tags", type: "Array"', ->
      expected =
        name:      'tags'
        type:      'Array'
        humanName: 'Tags'
        fieldType: 'string'
        value:     "A tags"

      attribute = generator.buildAttribute('tags', 'Array')

      for key, value of expected
        assert.deepEqual value, attribute[key]
  
  test '#buildApp'
  test '#buildUser'