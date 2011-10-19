Metro  = require('../lib/metro')

class UserModule
  name:           "Lance"
  @default_name:  "User"

class UserExtendingFunction
  @include UserModule

class UserExtendingClass extends Class
  @include UserModule
  
describe "support", ->
  describe "class", ->
    it "should allow submodules", ->
      expect(UserModule).toEqual(UserModule)

    it "should allow include", ->
      user = new UserExtendingFunction
      expect(user.name).toEqual("Lance")
      user = new UserExtendingClass
      expect(user.name).toEqual("Lance")

    it "should allow extend", ->
      expect(UserExtendingFunction.default_name).toEqual("User")
      expect(UserExtendingClass.default_name).toEqual("User")
  
  describe "file", ->
    beforeEach ->
      @path        = "./spec/fixtures/javascripts/application.js"
      @file        = new Metro.Assets.Asset(@environment, @path)
  
    it "should stat file", ->
      expect(@file.stat()).toBeTruthy()
    
    it "should digest file names", ->
      expect(typeof(@file.digest())).toEqual("string")
    
    it "should get the content type", ->
      expect(@file.content_type()).toEqual("application/javascript")
    
    it "should get the mtime", ->
      expect(@file.mtime()).toBeTruthy()
    
    it "should get the file size", ->
      expect(@file.size()).toEqual 54
    
    it "should have the path fingerprint", ->
      @file = new Metro.Assets.Asset(@environment, "./spec/fixtures/javascripts/application.js")
      expect(@file.path_fingerprint()).toEqual null
    
      @file = new Metro.Assets.Asset(@environment, "./spec/fixtures/javascripts/application-49fdaad23a42d2ce96e4190c34457b5a.js")
      expect(@file.path_fingerprint()).toEqual "49fdaad23a42d2ce96e4190c34457b5a"
    
    it "should add fingerprint to path", ->
      path = @file.path_with_fingerprint("49fdaad23a42d2ce96e4190c34457b5a")
      expect(path).toEqual "spec/fixtures/javascripts/application-49fdaad23a42d2ce96e4190c34457b5a.js"
    
    it "should extract extensions", ->
      @file = new Metro.Assets.Asset(@environment, "./spec/fixtures/javascripts/application.js")
      expect(@file.extensions()).toEqual ["js"]
    
      @file = new Metro.Assets.Asset(@environment, "./spec/fixtures/javascripts/application.js.coffee")
      expect(@file.extensions()).toEqual ["js", "coffee"]