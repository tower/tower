require('./helper')

yui      = new Metro.Compilers.Yui
uglifier = new Metro.Compilers.Uglifier

describe "assets", ->
  describe "asset", ->
    beforeEach ->
      @file = new Metro.Assets.Asset("./spec/fixtures/javascripts/application.js")
    
    it "should have the path fingerprint", ->
      expect(@file.path_fingerprint()).toEqual null
    
      @file = new Metro.Assets.Asset("./spec/fixtures/javascripts/application-49fdaad23a42d2ce96e4190c34457b5a.js")
      expect(@file.path_fingerprint()).toEqual "49fdaad23a42d2ce96e4190c34457b5a"
    
    it "should add fingerprint to path", ->
      path = @file.path_with_fingerprint("49fdaad23a42d2ce96e4190c34457b5a")
      expect(path).toEqual "spec/fixtures/javascripts/application-49fdaad23a42d2ce96e4190c34457b5a.js"
    
    it "should extract extensions", ->
      expect(@file.extensions()).toEqual [".js"]
    
      @file = new Metro.Assets.Asset("./spec/fixtures/javascripts/application.js.coffee")
      expect(@file.extensions()).toEqual [".js", ".coffee"]
      
  describe "configuration", ->
    it "should configure", ->
      expect(Metro.Assets.config.js_compressor).toEqual("uglifier")
      expect(Metro.Assets.config.css_compressor).toEqual("yui")
      
      Metro.configure ->
        @assets.precompile     = ["application.js", "vendor.js", "application.css", "theme.css"]
        @assets.version        = 1.0
        @assets.enabled        = true
        @assets.js_compressor  = "random"
        @assets.css_compressor = "scss"
        @assets.css_paths      = ["./spec/fixtures/stylesheets"]
        @assets.js_paths       = ["./spec/fixtures/javascripts"]
      
      expect(Metro.Assets.config.js_compressor).toEqual("random")
      expect(Metro.Assets.config.css_compressor).toEqual("scss")
    
    it "should use the YUI compressor", ->
      expected  = "body{background:red}"
      result    = yui.compress("body { background: red; }")
      
      expect(result).toEqual(expected)
    
    it "should use the UglifyJS compressor", ->
      string    = '''
      $(document).ready(function() {
        alert("ready!")
      });
      '''
      expected  = '$(document).ready(function(){alert("ready!")})'
      result    = uglifier.compress(string)
      
      expect(result).toEqual(expected)
    
    # it "should process javascript directives", ->
    #   processor = new Metro.Assets.Processor(new Metro.Compilers.Uglifier, extension: ".js", terminator: ";")
    #   result = processor.process
    #     paths: ["./spec/fixtures/javascripts"]
    #     files: ["directives.js"]
    #     
    #   expect(result).toEqual {directives: 'alert("child a"),alert("child b"),alert("directives")'}
      
  describe "compressor", ->
    beforeEach ->
      Metro.configure ->
        @assets.path            = "./spec/tmp/assets"
        @assets.css_compressor  = "yui"
        @assets.js_compressor   = "uglifier"
        @assets.js              = ["application.js"]
        @assets.css             = ["application.css"]
        @assets.css_paths       = ["./spec/fixtures/stylesheets"]
        @assets.js_paths        = ["./spec/fixtures/javascripts"]
        @assets.host            = "http://cloud.example.com"
        @assets.host            = (source) -> 
          if source.match(/images/)
            "http://img.example.com"
          else
            "http://assets.example.com"
        
    it "should process through the api", ->
      result = Metro.Assets.process()
      
      expect(result.css).toEqual
        'application': 'body{background:red}'
        
      expect(result.js).toEqual
        'application': '$(document).ready(function(){alert("ready!")})'
      
    it "should create a digest for a file", ->
    
  describe "render", ->
    it "should render async", ->
      environment = Metro.Application.instance().assets()
      environment.load_paths = ["./spec/fixtures"]
      asset = new Metro.Assets.Asset("./spec/fixtures/javascripts/directives.js", ".js")
      asset.render (result) ->
        expect(result).toEqual '''
alert("child a");
alert("child b");
//= require directive_child_a
//= require directive_child_b

alert("directives");


        '''
  
  describe "environment", ->
    beforeEach ->
      @environment                      = new Metro.Assets.Environment
      @environment.public_path          = "./spec/spec-app/public"
      @environment.load_paths           = ["./spec/fixtures"]
      @environment.javascript_directory = "javascripts"
      Metro.Application.instance()._assets  = @environment
    
    it "should normalize the extension", ->
      expect(@environment.normalize_extension("application", ".js")).toEqual "application.js"
      expect(@environment.normalize_extension("application.js", ".js")).toEqual "application.js"
    
    it "should normalize the asset directory", ->
      expect(@environment.normalize_asset_path("application.js", directory: "javascripts", digest: false)).toEqual "/javascripts/application.js"
      
    it "should compute the asset path", ->
      expect(@environment.compute_public_path("application.js", directory: "javascripts", digest: false)).toEqual "/javascripts/application.js"

    it "should lookup the asset paths", ->
      result = @environment.lookup("application.js")
      expect(result).toEqual [
        'spec/fixtures/javascripts/application.js',
        'spec/fixtures/javascripts/application.js.coffee' 
      ]
      
    it "should find and build assets", ->
      result = @environment.find("application.js")
      expect(result.read()).toEqual '''
$(document).ready(function() {
  alert("ready!");
});

      '''
      expect(Metro.Application.instance().assets().find("application.js").read()).toEqual '''
$(document).ready(function() {
  alert("ready!");
});

      '''
###    
    it "should compute the public path given a key", ->
      dir = "#{process.cwd()}/spec/fixtures/javascripts"
    
      expect(@environment.rewrite_extension("application", "js")).toEqual "application.js"
      expect(@environment.rewrite_asset_path("application.js", dir, ext: "js", digest: false)).toEqual "#{process.cwd()}/spec/fixtures/javascripts/application.js"
      expect(@environment.rewrite_asset_path("application.js", dir, ext: "js", digest: true)).toEqual "#{process.cwd()}/spec/fixtures/javascripts/application-49fdaad23a42d2ce96e4190c34457b5a.js"
      
      expect(@environment.compute_public_path("application", dir, ext: "js")).toEqual "./spec/spec-app/public/javascripts/application.js"
      
###
