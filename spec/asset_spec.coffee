require './helper'

describe "assets", ->
  describe "asset", ->
    beforeEach ->
      @file = new Metro.Asset("./spec/fixtures/javascripts/application.js")
    
    it "should have the path fingerprint", ->
      expect(@file.path_fingerprint()).toEqual null
      
      @file = new Metro.Asset("./spec/fixtures/javascripts/application-49fdaad23a42d2ce96e4190c34457b5a.js")
      expect(@file.path_fingerprint()).toEqual "49fdaad23a42d2ce96e4190c34457b5a"
    