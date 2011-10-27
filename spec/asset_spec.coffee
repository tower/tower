require './helper'

describe "assets", ->
  describe "path", ->
    beforeEach ->
      @file = new Metro.Asset("./spec/fixtures/javascripts/application.js")
    
    it "should have the path fingerprint", ->
      expect(@file.path_fingerprint()).toEqual null
      
      @file = new Metro.Asset("./spec/fixtures/javascripts/application-49fdaad23a42d2ce96e4190c34457b5a.js")
      expect(@file.path_fingerprint()).toEqual "49fdaad23a42d2ce96e4190c34457b5a"
    
    it "should add fingerprint to path", ->
      path = @file.path_with_fingerprint("49fdaad23a42d2ce96e4190c34457b5a")
      expect(path).toEqual "spec/fixtures/javascripts/application-49fdaad23a42d2ce96e4190c34457b5a.js"
    
    it "should extract extensions", ->
      expect(@file.extensions()).toEqual [".js"]
      
      @file = new Metro.Asset("./spec/fixtures/javascripts/application.js.coffee")
      expect(@file.extensions()).toEqual [".js", ".coffee"]
    
  describe 'lookup', ->
    it 'should search for assets by priority', ->
    
    it 'should allow absolute paths to assets', ->
    
    it 'should allow nested assets', ->
    
    it 'should find file if file is named same as folder in a different load path', ->
    
    it 'should find files with . dots in their name', ->
    
    it 'should ignore files starting with a ~ tilde', ->
      
  describe "compression", ->
    it "should use the YUI compressor", ->
      expected  = "body{background:red}"
      result    = Metro.Asset.css_compressor().render("body { background: red; }")
      
      expect(result).toEqual(expected)
    
    it "should use the UglifyJS compressor", ->
      string    = '''
      $(document).ready(function() {
        alert("ready!")
      });
      '''
      expected  = '$(document).ready(function(){alert("ready!")})'
      result    = Metro.Asset.js_compressor().render(string)
      
      expect(result).toEqual(expected)
    
    # it "should process javascript directives", ->
    #   processor = new Metro.Asset.Processor(new Metro.Compilers.Uglifier, extension: ".js", terminator: ";")
    #   result = processor.process
    #     paths: ["./spec/fixtures/javascripts"]
    #     files: ["directives.js"]
    #     
    #   expect(result).toEqual {directives: 'alert("child a"),alert("child b"),alert("directives")'}
      
  describe "compressor", ->
    beforeEach ->
      Metro.Asset.configure
        path            : "./spec/tmp/assets"
        js              : ["application.js"]
        css             : ["application.css"]
        css_paths       : ["./spec/fixtures/stylesheets"]
        js_paths        : ["./spec/fixtures/javascripts"]
        host            : "http://cloud.example.com"
        host            : (source) -> 
          if source.match(/images/)
            "http://img.example.com"
          else
            "http://assets.example.com"
        
    it "should write digested files", ->
      #result = Metro.Asset.process()
      #
      #expect(result.css).toEqual
      #  'application': 'body{background:red}'
      #  
      #expect(result.js).toEqual
      #  'application': '$(document).ready(function(){alert("ready!")})'
      
    it "should create a digest for a file", ->
    
  describe "render", ->
    it "should render async", ->
      Metro.Application.teardown()
      Metro.Application.initialize()
      Metro.Asset.config.load_paths = ["./spec/fixtures"]
      asset = new Metro.Asset("./spec/fixtures/javascripts/directives.js", ".js")
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
      Metro.Application.teardown()
      Metro.Application.initialize()
      Metro.Asset.config.load_paths = ["./spec/fixtures"]
    
    it "should normalize the extension", ->
      expect(Metro.Asset.normalize_extension("application", ".js")).toEqual "application.js"
      expect(Metro.Asset.normalize_extension("application.js", ".js")).toEqual "application.js"
    
    it "should normalize the asset directory", ->
      expect(Metro.Asset.normalize_asset_path("application.js", directory: "javascripts", digest: false)).toEqual "/javascripts/application.js"
      
    it "should compute the asset path", ->
      expect(Metro.Asset.compute_public_path("application.js", directory: "javascripts", digest: false)).toEqual "/javascripts/application.js"
      
    it "should find and build assets", ->
      result = Metro.Asset.find("application", extension: ".js")
      expect(result.read()).toEqual '''
$(document).ready(function() {
  alert("ready!");
});

      '''
      expect(Metro.Asset.find("application.js").read()).toEqual '''
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
