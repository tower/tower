require('./helper')

describe "middleware", ->
  describe "assets", ->
    beforeEach ->
      @environment                      = new Metro.Assets.Environment
      @environment.public_path          = "./spec/spec-app/public"
      @environment.load_paths           = ["./spec/fixtures"]
      @environment.javascript_directory = "javascripts"
      Metro.Application.instance()._assets  = @environment
      
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
  