require './helper'

describe "assets", ->
  describe "path", ->
    beforeEach ->
      @file = new Metro.Asset("spec/spec-app/app/assets/javascripts/application.js")
    
    it "should have the path fingerprint", ->
      expect(@file.pathFingerprint()).toEqual null
      
      @file = new Metro.Asset("spec/spec-app/app/assets/javascripts/application-49fdaad23a42d2ce96e4190c34457b5a.js")
      expect(@file.pathFingerprint()).toEqual "49fdaad23a42d2ce96e4190c34457b5a"
    
    it "should add fingerprint to path", ->
      path = @file.pathWithFingerprint("49fdaad23a42d2ce96e4190c34457b5a")
      expect(path).toEqual "spec/spec-app/app/assets/javascripts/application-49fdaad23a42d2ce96e4190c34457b5a.js"
    
    it "should extract extensions", ->
      expect(@file.extensions()).toEqual [".js"]
      
      @file = new Metro.Asset("spec/spec-app/app/assets/javascripts/application.js.coffee")
      expect(@file.extensions()).toEqual [".js", ".coffee"]
      
    it 'should extract extensions except the names in dot separated names', ->
    
  describe 'lookup', ->
    it 'should remove the public path pattern', ->
      expect(Metro.Asset.normalizeSource("/stylesheets/application.css")).toEqual "application.css"
      expect(Metro.Asset.normalizeSource("/javascripts/application.js")).toEqual "application.js"
      expect(Metro.Asset.normalizeSource("/assets/application.js")).toEqual "application.js"
      
    it 'should search for assets by priority', ->
      asset = Metro.Asset.find("/stylesheets/application.css", extension: '.css')
      expect(asset.relativePath()).toEqual 'spec/spec-app/app/assets/stylesheets/application.css'
    
    it 'should allow absolute paths to assets from inside a directive', ->
      directivePath = "./lib/assets/stylesheets/theme"
      asset         = Metro.Asset.find(directivePath, extension: '.css')
      expect(asset.relativePath()).toEqual "spec/spec-app/lib/assets/stylesheets/theme.less"
      
      directivePath = "theme"
      asset         = Metro.Asset.find(directivePath, extension: '.css')
      expect(asset.relativePath()).toEqual "spec/spec-app/app/assets/stylesheets/theme.less"
    
    it 'should allow nested assets', ->
    
    it 'should find file if file is named same as folder in a different load path', ->
      expect(Metro.Asset.find("history", extension: '.js').relativePath()).toEqual "spec/spec-app/app/assets/javascripts/history.coffee"
      expect(Metro.Asset.find("./vendor/assets/javascripts/history", extension: '.js').relativePath()).toEqual "spec/spec-app/vendor/assets/javascripts/history.js"
      expect(Metro.Asset.find("./vendor/assets/javascripts/history/history", extension: '.js').relativePath()).toEqual "spec/spec-app/vendor/assets/javascripts/history/history.js"
    
    it 'should find files with . dots in their name', ->
      expect(Metro.Asset.find("jquery.markedit", extension: '.js').relativePath()).toEqual "spec/spec-app/vendor/assets/javascripts/jmd/jquery.markedit.js"
    
    it 'should ignore files starting with a ~ tilde', ->
      expect(Metro.Asset.lookup("search", extension: '.js')[0]).toBeFalsy()
      expect(Metro.Asset.lookup("~search", extension: '.js')[0]).toBeTruthy()
      
  describe "render", ->
    it "should use the YUI compressor", ->
      expected  = "body{background:red}"
      result    = Metro.Asset.cssCompressor().render("body { background: red; }")
      
      expect(result).toEqual(expected)
    
    it "should use the UglifyJS compressor", ->
      string    = '''
      $(document).ready(function() {
        alert("ready!")
      });
      '''
      expected  = '$(document).ready(function(){alert("ready!")})'
      result    = Metro.Asset.jsCompressor().render(string)
      
      expect(result).toEqual(expected)
      
    it "should create a manifest", ->
    
    it "should render async", ->
      asset = new Metro.Asset("spec/spec-app/app/assets/javascripts/directives.js", ".js")
      asset.render (result) ->
        expect(result).toEqual '''
alert("child a");
alert("child b");
alert("history!!!");

//= require directive_child_a
//= require directive_child_b
//= require ./vendor/assets/javascripts/history/history

alert("directives");


        '''
  
  describe "environment", ->
    it "should normalize the extension", ->
      expect(Metro.Asset.normalizeExtension("application", ".js")).toEqual "application.js"
      expect(Metro.Asset.normalizeExtension("application.js", ".js")).toEqual "application.js"
    
    it "should normalize the asset directory", ->
      expect(Metro.Asset.normalizeAssetPath("application.js", directory: "javascripts", digest: false)).toEqual "/javascripts/application.js"
      
    it "should compute the asset path", ->
      expect(Metro.Asset.computePublicPath("application.js", directory: "javascripts", digest: false)).toEqual "/javascripts/application.js"
      
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
      dir = "#{process.cwd()}/spec/spec-app/app/assets/javascripts"
    
      expect(@environment.rewriteExtension("application", "js")).toEqual "application.js"
      expect(@environment.rewriteAssetPath("application.js", dir, ext: "js", digest: false)).toEqual "#{process.cwd()}/spec/spec-app/app/assets/javascripts/application.js"
      expect(@environment.rewriteAssetPath("application.js", dir, ext: "js", digest: true)).toEqual "#{process.cwd()}/spec/spec-app/app/assets/javascripts/application-49fdaad23a42d2ce96e4190c34457b5a.js"
      
      expect(@environment.computePublicPath("application", dir, ext: "js")).toEqual "./spec/spec-app/public/javascripts/application.js"
      
###
