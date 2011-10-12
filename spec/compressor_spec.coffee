Metro    = require('../lib/metro')
yui      = new Metro.Asset.YuiCompressor
uglifier = new Metro.Asset.UglifierCompressor

describe "metro.asset", ->
  describe "configuration", ->
    it "should configure", ->
      expect(Metro.Asset.config.js_compressor).toEqual("uglifier")
      expect(Metro.Asset.config.css_compressor).toEqual("yui")
      
      Metro.configure ->
        @assets.precompile     = ["application.js", "vendor.js", "application.css", "theme.css"]
        @assets.version        = 1.0
        @assets.enabled        = true
        @assets.js_compressor  = "random"
        @assets.css_compressor = "scss"
        @assets.css_paths      = ["./spec/fixtures/stylesheets"]
        @assets.js_paths       = ["./spec/fixtures/javascripts"]
      
      expect(Metro.Asset.config.js_compressor).toEqual("random")
      expect(Metro.Asset.config.css_compressor).toEqual("scss")
      
  describe "css", ->
    it "should use the YUI compressor", ->
      expected  = "body{background:red}"
      result    = yui.compress("body { background: red; }")
      
      expect(result).toEqual(expected)
    
  describe "js", ->
    it "should use the UglifyJS compressor", ->
      string    = '''
      $(document).ready(function() {
        alert("ready!")
      });
      '''
      expected  = '$(document).ready(function(){alert("ready!")})'
      result    = uglifier.compress(string)
      
      expect(result).toEqual(expected)
      
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
        
    it "should process through the api", ->
      result = Metro.Asset.process()
      
      expect(result.css).toEqual
        'application': 'body{background:red}'
        
      expect(result.js).toEqual
        'application': '$(document).ready(function(){alert("ready!")})'
    
    it "should write", ->
      Metro.Asset.compile()
      
      