require('./helper')

describe "services", ->
  describe "s3", ->
    beforeEach ->
      @service = Metro.Services.s3
      
    it "should upload", ->
      #@service.upload "./spec/fixtures/javascripts/application.js", "/app.js", (error, response) ->
      #  console.log error
      #  console.log response