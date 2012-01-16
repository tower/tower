require '../../config'

scope     = null
criteria  = null

###
describe 'Tower.Model.Validation', ->
  beforeEach ->
    spec.resetUserStore()
    @user = new User(id: 1)
  
  it 'should be invalid', ->
    expect(@user.validate()).toEqual false
    
    expect(@user.errors).toEqual({ 'firstName' : ["firstName can't be blank"] })
    
    @user.firstName = "Joe"
    
    expect(@user.validate()).toEqual true
    expect(@user.errors).toEqual []
    
    @user.firstName = null
    
    expect(@user.validate()).toEqual false
    expect(@user.errors).toEqual({ 'firstName' : ["firstName can't be blank"] })
  
  it 'should validate from attribute definition', ->
    page = new Page(title: "A Page")
    
    expect(page.validate()).toEqual false
    expect(page.errors).toEqual { 'rating': ['rating must be a minimum of 0', 'rating must be a maximum of 10' ] }
    
    page.rating = 10
    
    expect(page.validate()).toEqual true
    expect(page.errors).toEqual []
###
