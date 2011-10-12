Metro  = require('../../lib/metro')
yui    = new Metro.Asset.YUICompressor
uglify = new Metro.Asset.UglifyJSCompressor

describe "metro.asset", ->
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
      result    = uglify.compress(string)
      
      expect(result).toEqual(expected)
      