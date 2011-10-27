require './helper'

class UserModule
  name:           "Lance"
  @default_name:  "User"

class UserExtendingFunction
  @include UserModule

class UserExtendingClass extends Metro.Support.Class
  constructor: -> super
  
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
      @file        = new Metro.Support.Path(@path)#.Assets.Asset(@environment, @path)
  
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
      
    it "should find entries in a directory", ->
      expect(Metro.Support.Path.entries("./spec/fixtures/javascripts")[0]).toEqual 'application.js' 
  
  describe "lookup", ->
    beforeEach ->
      # Metro.Support.Path.glob("./spec/fixtures/javascripts")
      @lookup = new Metro.Support.Lookup
        paths:      ["./spec/fixtures/javascripts"]
        extensions: ["js", "coffee"]
        aliases:
          js: ["coffee", "coffeescript"]
          coffee: ["coffeescript"]
          
    it "should normalize extensions and aliases", ->
      expect(@lookup.extensions).toEqual ['.js', '.coffee']
      expect(@lookup.aliases).toEqual
        ".js":      ['.coffee', '.coffeescript']
        ".coffee":  [".coffeescript"]
    
    it "should build a pattern for a basename", ->
      pattern = @lookup.build_pattern("application.js")
      expect(pattern.toString()).toEqual /^application(?:\.js|\.coffee|\.coffeescript).*/.toString()
      
      pattern = @lookup.build_pattern("application.coffee")
      expect(pattern.toString()).toEqual /^application(?:\.coffee|\.coffeescript).*/.toString()
      
      pattern = @lookup.build_pattern("application.js.coffee")
      expect(pattern.toString()).toEqual /^application\.js(?:\.coffee|\.coffeescript).*/.toString()
      
    it "should find", ->
      result = @lookup.find("application.js")
      expect(result).toEqual ['spec/fixtures/javascripts/application.js', 'spec/fixtures/javascripts/application.js.coffee']
      
      result = @lookup.find("application.coffee")
      expect(result).toEqual []
###  
  describe "mixins", ->
    it "should have string methods", ->
      Metro.Support.to_ruby()
      string = "UserModel"
      expect(string.underscore()).toEqual "user_model"
      expect(string.underscore().camelize()).toEqual "UserModel"
      
    it "should convert to underscore", ->
      _ = require('underscore')
      _.mixin Metro.Support.to_underscore()
      
      expect(_.extract_options([1, 2, 3, {one: "two"}])).toEqual({one:"two"})
###      