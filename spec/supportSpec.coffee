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
