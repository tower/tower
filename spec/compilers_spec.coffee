Metro   = require('../lib/metro')
fs      = require('fs')
_       = require('underscore')

describe "compilers", ->
  describe "stylus", ->
    it "should compile stylus", ->
      template = new Metro.Compilers.Stylus
      result = template.compile "./spec/fixtures/stylesheets/stylus.styl"
      expect(result).toEqual fs.readFileSync("./spec/fixtures/stylesheets/stylus.css", 'utf8')
        
  describe "jade", ->
    it "should compile jade", ->
      template = new Metro.Compilers.Jade
      template.compile "./spec/fixtures/views/jade.jade", (error, result) ->
        expect(result).toEqual fs.readFileSync("./spec/fixtures/views/jade.html", 'utf8')
  
  describe "haml", ->
    it "should compile haml", ->
      template = new Metro.Compilers.Haml
      template.compile "./spec/fixtures/views/haml.haml", (error, result) ->
        expect(result).toEqual fs.readFileSync("./spec/fixtures/views/haml.html", 'utf8')
  
  describe "ejs", ->
    it "should compile ejs", ->
      template = new Metro.Compilers.Ejs
      template.compile "./spec/fixtures/views/ejs.ejs", {locals: {name: "My Name"}}, (error, result) ->
        expect(result).toEqual fs.readFileSync("./spec/fixtures/views/ejs.html", 'utf8')
  
  describe "coffee_script", ->
    it "should compile coffee script", ->
      template = new Metro.Compilers.CoffeeScript
      result = template.compile "./spec/fixtures/javascripts/coffee.coffee", {locals: {name: "My Name"}}
      expect(result).toEqual fs.readFileSync("./spec/fixtures/javascripts/coffee.js", 'utf8')
  
  describe "less", ->
    it "should compile less", ->
      template = new Metro.Compilers.Less
      result = template.compile "./spec/fixtures/stylesheets/less.less"
      expect(result).toEqual fs.readFileSync("./spec/fixtures/stylesheets/less.css", 'utf8')
      
  # describe "scss", ->
  #   it "should compile scss", ->
  #     template = new Metro.Compilers.Scss
  #     result = template.compile "./spec/fixtures/stylesheets/scss.scss"
  #     expect(result).toEqual fs.readFileSync("./spec/fixtures/stylesheets/scss.css", 'utf8')
  
  describe "mustache", ->
    it "should compile mustache", ->
      template = new Metro.Compilers.Mustache
      locals = {name: "World", say_hello: -> "Hello" }
      result = template.compile "./spec/fixtures/views/mustache.mustache", locals: locals
      expect(result).toEqual fs.readFileSync("./spec/fixtures/views/mustache.html", 'utf8')
      
  describe "sass", ->
    it "should compile sass", ->
      template = new Metro.Compilers.Sass
      result = template.compile "./spec/fixtures/stylesheets/sass.sass"
      expect(result).toEqual fs.readFileSync("./spec/fixtures/stylesheets/sass.css", 'utf8')
      
  describe "markdown", ->
    it "should compile markdown", ->
      template = new Metro.Compilers.Markdown
      result = template.compile "./spec/fixtures/docs/markdown.markdown"
      expect(result).toEqual fs.readFileSync("./spec/fixtures/docs/markdown.html", 'utf8')
###      
  describe "sprite", ->
    it "should create a sprite map", ->
      engine = new Metro.Compilers.Sprite
      images = _.map ["facebook.png", "github.png", "linkedIn.png", "twitter.png"], (file) -> "./spec/fixtures/images/#{file}"
      
      data = {}
      
      runs ->
        engine.montage images: images, (result) ->
          data = result
      
      waits 500
      
      runs ->
        expect(data[0]).toEqual
          format: 'png', width: 64, height: 64, depth: 8, path: './spec/fixtures/images/facebook.png', slug: 'facebook', y: 5
        expect(data[1]).toEqual
          format: 'png', width: 64, height: 64, depth: 8, path: './spec/fixtures/images/github.png', slug: 'github', y: 69
        expect(data[2]).toEqual
          format: 'png', width: 64, height: 64, depth: 8, path: './spec/fixtures/images/linkedIn.png', slug: 'linkedIn', y: 133
        expect(data[3]).toEqual
          format: 'png', width: 64, height: 64, depth: 8, path: './spec/fixtures/images/twitter.png', slug: 'twitter', y: 197
    
    it "should render stylus", ->
      engine = new Metro.Compilers.Sprite
      images = _.map ["facebook.png", "github.png", "linkedIn.png", "twitter.png"], (file) -> "./spec/fixtures/images/#{file}"
      
      stylus = ""
      
      runs ->
        engine.render images: images, format: "stylus", (result) ->
          stylus = result
          
      waits 1000
      
      runs ->
        expect(stylus).toEqual '''
sprite(slug, x, y)
  if slug == "facebook"
    background: url(./spec/fixtures/images/facebook.png) 0px 5px no-repeat;
  else if slug == "github"
    background: url(./spec/fixtures/images/github.png) 0px 69px no-repeat;
  else if slug == "linkedIn"
    background: url(./spec/fixtures/images/linkedIn.png) 0px 133px no-repeat;
  else slug == "twitter"
    background: url(./spec/fixtures/images/twitter.png) 0px 197px no-repeat;

        '''
        
    it "should render css", ->
      engine = new Metro.Compilers.Sprite
      images = _.map ["facebook.png", "github.png", "linkedIn.png", "twitter.png"], (file) -> "./spec/fixtures/images/#{file}"
      
      stylus = ""
      
      runs ->
        engine.render images: images, format: "css", name: "sprite", (result) ->
          stylus = result
          
      waits 1000
      
      runs ->
        expect(stylus).toEqual '''
.facebook-sprite {
  background: url(./spec/fixtures/images/facebook.png) 0px 5px no-repeat;
}
.github-sprite {
  background: url(./spec/fixtures/images/github.png) 0px 69px no-repeat;
}
.linkedIn-sprite {
  background: url(./spec/fixtures/images/linkedIn.png) 0px 133px no-repeat;
}
.twitter-sprite {
  background: url(./spec/fixtures/images/twitter.png) 0px 197px no-repeat;
}

        '''
###        