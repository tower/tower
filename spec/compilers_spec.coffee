require('./helper')

describe "compilers", ->
  describe "stylus", ->
    it "should compile stylus", ->
      template  = new Metro.Compilers.Stylus
      input     = Metro.Support.Path.read("./spec/fixtures/stylesheets/stylus.styl")
      output    = Metro.Support.Path.read("./spec/fixtures/stylesheets/stylus.css")
      expect(template.compile(input)).toEqual output
        
  describe "jade", ->
    it "should compile jade", ->
      template  = new Metro.Compilers.Jade
      input     = Metro.Support.Path.read("./spec/fixtures/views/jade.jade")
      output    = Metro.Support.Path.read("./spec/fixtures/views/jade.html")
      template.compile input, (error, result) ->
        expect(result).toEqual output
  
  describe "haml", ->
    it "should compile haml", ->
      template  = new Metro.Compilers.Haml
      input     = Metro.Support.Path.read("./spec/fixtures/views/haml.haml")
      output    = Metro.Support.Path.read("./spec/fixtures/views/haml.html")
      template.compile input, (error, result) ->
        expect(result).toEqual output
  
  describe "ejs", ->
    it "should compile ejs", ->
      template  = new Metro.Compilers.Ejs
      input     = Metro.Support.Path.read("./spec/fixtures/views/ejs.ejs")
      output    = Metro.Support.Path.read("./spec/fixtures/views/ejs.html")
      template.compile input, {locals: {name: "My Name"}}, (error, result) ->
        expect(result).toEqual output
  
  describe "coffee_script", ->
    it "should compile coffee script", ->
      template  = new Metro.Compilers.CoffeeScript
      input     = Metro.Support.Path.read("./spec/fixtures/javascripts/coffee.coffee")
      output    = Metro.Support.Path.read("./spec/fixtures/javascripts/coffee.js")
      result = template.compile input, {locals: {name: "My Name"}}
      expect(result).toEqual output
  
  describe "less", ->
    it "should compile less", ->
      template  = new Metro.Compilers.Less
      input     = Metro.Support.Path.read("./spec/fixtures/stylesheets/less.less")
      output    = Metro.Support.Path.read("./spec/fixtures/stylesheets/less.css")
      result    = template.compile input
      expect(result).toEqual output
  
  describe "mustache", ->
    it "should compile mustache", ->
      template  = new Metro.Compilers.Mustache
      input     = Metro.Support.Path.read("./spec/fixtures/views/mustache.mustache")
      output    = Metro.Support.Path.read("./spec/fixtures/views/mustache.html")
      locals = {name: "World", say_hello: -> "Hello" }
      result = template.compile input, locals: locals
      expect(result).toEqual output
      
  describe "sass", ->
    it "should compile sass", ->
      template  = new Metro.Compilers.Sass
      input     = Metro.Support.Path.read("./spec/fixtures/stylesheets/sass.sass")
      output    = Metro.Support.Path.read("./spec/fixtures/stylesheets/sass.css")
      result = template.compile input
      expect(result).toEqual output
      
  describe "markdown", ->
    it "should compile markdown", ->
      template  = new Metro.Compilers.Markdown
      input     = Metro.Support.Path.read("./spec/fixtures/docs/markdown.markdown")
      output    = Metro.Support.Path.read("./spec/fixtures/docs/markdown.html")
      result = template.compile input
      expect(result).toEqual output
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