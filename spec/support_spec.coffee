require './helper'

class UserModule
  name:           "Lance"
  @defaultName:  "User"

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
      expect(UserExtendingFunction.defaultName).toEqual("User")
      expect(UserExtendingClass.defaultName).toEqual("User")
  
  describe "path", ->
    beforeEach ->
      @path        = "spec/spec-app/app/assets/javascripts/application.js"
      @file        = new Metro.Support.Path(@path)#.Assets.Asset(@environment, @path)
  
    it "should stat file", ->
      expect(@file.stat()).toBeTruthy()
    
    it "should digest file names", ->
      expect(typeof(@file.digest())).toEqual("string")
    
    it "should get the content type", ->
      expect(@file.contentType()).toEqual("application/javascript")
    
    it "should get the mtime", ->
      expect(@file.mtime()).toBeTruthy()
    
    it "should get the file size", ->
      expect(@file.size()).toEqual 54
      
    it "should find entries in a directory", ->
      expect(Metro.Support.Path.entries("spec/spec-app/app/assets/javascripts")[1]).toEqual 'application.coffee'
      
    it "should generate absolute path", ->
      expected = "#{process.cwd()}/spec/spec-app/app/assets/javascripts"
      expect(Metro.Support.Path.absolutePath("spec/spec-app/app/assets/javascripts")).toEqual expected
      
    it "should generate relative path", ->
      expected = "spec/spec-app/app/assets/javascripts"
      expect(Metro.Support.Path.relativePath("spec/spec-app/app/assets/javascripts")).toEqual expected
  
  describe "lookup", ->
    beforeEach ->
      # Metro.Support.Path.glob("spec/spec-app/app/assets/javascripts")
      @lookup = new Metro.Support.Lookup
        paths:      ["spec/spec-app/app/assets/javascripts"]
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
      pattern = @lookup.buildPattern("application.js")
      expect(pattern.toString()).toEqual /^application(?:\.js|\.coffee|\.coffeescript).*/.toString()
      
      pattern = @lookup.buildPattern("application.coffee")
      expect(pattern.toString()).toEqual /^application(?:\.coffee|\.coffeescript).*/.toString()
      
      pattern = @lookup.buildPattern("application.js.coffee")
      expect(pattern.toString()).toEqual /^application\.js(?:\.coffee|\.coffeescript).*/.toString()
      
    it "should find", ->
      result = @lookup.find("application.js")
      expect(result.length).toEqual 3
      
      result = @lookup.find("application.coffee")
      expect(result.length).toEqual 1
  
  describe 'i18n', ->
    beforeEach ->
      global.I18n = Metro.Support.I18n
      I18n.store = 
        en:
          hello: "world"
          forms:
            titles:
              signup: "Signup"
          pages:
            titles:
              home: "Welcome to {{site}}"
          posts:
            comments:
              none: "No comments"
              one: "1 comment"
              other: "{{count}} comments"
          messages:
            past:
              none: "You never had any messages"
              one: "You had 1 message"
              other: "You had {{count}} messages"
            present:
              one: "You have 1 message"
            future:
              one: "You might have 1 message"
          
    it 'should lookup a key', ->
      expect(I18n.lookup("hello")).toEqual "world"
      
    it 'should interpolate a key', ->
      expect(I18n.translate("pages.titles.home", site: 'Metro.js')).toEqual "Welcome to Metro.js"
  
    it 'should count', ->
      expect(I18n.t("posts.comments", count: 0)).toEqual "No comments"
      expect(I18n.t("posts.comments", count: 1)).toEqual "1 comment"
      expect(I18n.t("posts.comments", count: 10)).toEqual "10 comments"
      
    it 'should have tense', ->
      expect(I18n.t("messages", count: 0, tense: 'past')).toEqual "You never had any messages"
      expect(I18n.t("messages", count: 1, tense: 'past')).toEqual "You had 1 message"
      expect(I18n.t("messages", count: 10, tense: 'past')).toEqual "You had 10 messages"
      
    it 'should have fallbacks', ->
    
###  
  describe "mixins", ->
    it "should have string methods", ->
      Metro.Support.toRuby()
      string = "UserModel"
      expect(string.underscore()).toEqual "userModel"
      expect(string.underscore().camelize()).toEqual "UserModel"
      
    it "should convert to underscore", ->
      _ = require('underscore')
      _.mixin Metro.Support.toUnderscore()
      
      expect(_.extractOptions([1, 2, 3, {one: "two"}])).toEqual({one:"two"})
###      
