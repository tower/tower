require '../../config'

describe 'Tower.Model', ->
  describe 'fields', ->
    beforeEach ->
      spec.resetUserStore()
      @user = new User(firstName: 'Terminator', id: 1)
      
    it 'should track attribute changes', ->
      expect(@user.changes).toEqual {}
      expect(@user.attributeChanged("firstName")).toEqual false
      
      @user.firstName = "T1000"
      
      expect(@user.changes).toEqual firstName: ["Terminator", "T1000"]
      
      @user.firstName = "Smith"
      
      expect(@user.changes).toEqual firstName: ["Terminator", "Smith"]
      
      expect(@user.attributeChanged("firstName")).toEqual true
      expect(@user.attributeWas("firstName")).toEqual "Terminator"
      expect(@user.attributeChange("firstName")).toEqual "Smith"