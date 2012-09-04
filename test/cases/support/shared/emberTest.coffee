describe 'Tower + Ember', ->
  ###
  #before ->
  #  global.window = global # tmp ember hack
  #
  #after ->
  #  delete global.window
  test 'coffeescript subclasses == ember subclasses', ->
    A1 = Ember.Object.extend()
    B1 = A1.extend()
    C1 = B1.extend()
    C2 = B1.extend()
    B2 = A1.extend()
    C3 = B2.extend()
    C4 = B2.extend()

    #class Model extends Base
    ember = []
    ember.push A1.subclasses.contains(B1) # true
    ember.push A1.subclasses.contains(B2) # true 
    ember.push A1.subclasses.contains(C1) # false
    ember.push A1.subclasses.contains(C2) # false
    ember.push B1.subclasses.contains(C1) # true
    ember.push B1.subclasses.contains(C2) # true
    ember.push B1.subclasses.contains(C3) # false
    ember.push B1.subclasses.contains(C4) # false
    
    class _B1 extends A1
      @aClassVariable: "aClassVariable!!!"
      @aClassMethod: -> "aClassMethod!!!"
      aVariable: "aVariable!!!"
      aMethod: -> "aMethod!!!"
  
    class _C1 extends _B1
    class _C2 extends _B1
    class _B2 extends A1
    class _C3 extends _B2
    class _C4 extends _B2

    coffee = []
    coffee.push A1.subclasses.contains(_B1) # true
    coffee.push A1.subclasses.contains(_B2) # true 
    coffee.push A1.subclasses.contains(_C1) # false
    coffee.push A1.subclasses.contains(_C2) # false
    coffee.push _B1.subclasses.contains(_C1) # true
    coffee.push _B1.subclasses.contains(_C2) # true
    coffee.push _B1.subclasses.contains(_C3) # false
    coffee.push _B1.subclasses.contains(_C4) # false
    
    assert.deepEqual ember, coffee

    assert.equal _C1.aClassVariable, "aClassVariable!!!"
    assert.equal _C1.aClassMethod(), "aClassMethod!!!"
    
    _c1 = new _C1
    
    assert.equal _c1.aVariable, "aVariable!!!"
    assert.equal _c1.aMethod(), "aMethod!!!"
    
  test 'class A extends Tower.Class (should be ember object)', ->
    class A extends Tower.Class
      
    assert.equal A.superclass.name, Tower.Class.name
      
  test '@include', ->
    viaInclude = 
      includedMethod: "includedMethod!"
      
    viaReopen =
      reopenedMethod: "reopenedMethod!"
      
    class A extends Tower.Class
      @include viaInclude
      @reopen viaReopen
      @reopenClass
        reopenedClassMethod: "reopenedClassMethod!"
      
    a = new A
      
    assert.equal a.includedMethod, "includedMethod!"
    assert.equal a.reopenedMethod, "reopenedMethod!"
    
    class B extends A
    
    assert.equal B.reopenedClassMethod, A.reopenedClassMethod
  ###    
  describe 'Tower.Model', ->
    test 'new demo', ->
      Base = Ember.Object.extend()
      
      class Model extends Base
        init: ->
          @INITTED = true
          
        get: (key) ->
          @[key]
          
      class User extends Model
        init: (attrs) ->
          @[key] = value for key, value of attrs
          @_super()

      user = new User(firstName: "Lance")
      assert.equal user.get('firstName'), "Lance"
      assert.equal user.INITTED, true
      
    test 'App namespace', ->
      assert.equal App.toString(), "App"
      assert.isTrue App instanceof Ember.Namespace
      
    test 'Model namespace', ->
      assert.equal App.Post.toString(), "App.Post"
      assert.equal App.Post.className(), "Post"
      
    test 'new', ->
      user = App.User.build(lastName: "Pollard")
      assert.equal user.get('lastName'), "Pollard"
    
    test 'metadata', ->
      metadata = App.Post.metadata()
      
      #console.log metadata
###      
  describe 'Tower.ModelScope', ->
    test 'instanceof Ember.ArrayProxy', ->
      scope = new Tower.ModelScope
      
      assert.isTrue scope instanceof Ember.ArrayProxy, "scope instanceof Ember.ArrayProxy"
      
    test 'ember array basics', ->
      array = Ember.ArrayProxy.create content: ["a", "b", "c"]
      assert.equal array.get('firstObject'), "a"
      assert.equal array.get('secondObject'), undefined
      assert.equal array.get('lastObject'), "c"
      assert.equal array.objectAt(1), "b"
      assert.equal array.indexOf("b"), 1
      
      array.addObject("d")
      
      assert.equal array.indexOf("d"), 3
      
      array.insertAt(2, "e")
      
      assert.equal array.indexOf("e"), 2
      assert.equal array.indexOf("d"), 4
      
      array.addObjects(["f", "g"])
      
      assert.equal array.content.length, 7
      
      array.addObjects(["f", "g"])
      
      assert.equal array.content.length, 7
      
      array.pushObjects(["f", "g"])
      
      assert.equal array.content.length, 9
      
      array.addObserver "[]", (_, key, value) ->
        assert.ok _, "addObserver [] called"
      
      array.addObserver "length", (_, key, value) ->
        assert.equal key, "length"
        assert.equal value, 12
        
      array.addObjects(["x", "y", "z"])
      
      assert.isTrue array.contains("x")
      assert.isFalse array.contains("q")
###