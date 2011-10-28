require './helper'

describe "middleware", ->
  describe "assets", ->
    beforeEach ->
      Metro.Asset.configure
       publicPath          : "./spec/spec-app/public"
       loadPaths           : ["./spec/fixtures"]
       javascriptDirectory : "javascripts"
      
      @middleware = Metro.Middleware.Assets.middleware
      
    it "should find assets", ->
      request   = { path: "application.js" }
      response  = {}
      #result    = @middleware(request, response)
      # expect(result).toEqual [ 200,
      #   { 'Content-Type': 'application/javascript',
      #     'Content-Length': undefined,
      #     'Cache-Control': 'public, max-age=31536000',
      #     'Last-Modified': Sat, 15 Oct 2011 05:18:55 GMT,
      #     ETag: '49fdaad23a42d2ce96e4190c34457b5a' },
      #   { path: 'spec/fixtures/javascripts/application.js' }
      # ]
      
  describe "body", ->
  
  describe "query", ->
  
  describe "router", ->
  
