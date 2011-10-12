Metro  = require('../lib/metro')

class UserModule
  name:           "Lance"
  @default_name:  "User"

class UserExtendingFunction
  @include UserModule
  
class UserExtendingClass extends Metro.Support.Class
  @include UserModule

describe "module", ->
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
