# doesn't work:
# Ember.Object.__extend = -> @extend arguments...

Ember.Object.reopenClass
  __extend: ->
    @extend arguments...
    
  __defineStaticProperty: (key, value) ->
    object = {}
    object[key] = value
    @reopenClass(object)
    
  __defineProperty: (key, value) ->
    object = {}
    object[key] = value
    @reopen(object)
    
describe 'Tower + Ember', ->
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
      
    a = new A
      
    assert.equal a.includedMethod, "includedMethod!"
    assert.equal a.reopenedMethod, "reopenedMethod!"