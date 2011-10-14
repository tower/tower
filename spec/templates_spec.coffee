Metro   = require('../lib/metro')
fs      = require('fs')

describe "templates", ->
  describe "stylus", ->
    it "should compile stylus", ->
      template = new Metro.Template.Stylus
      template.compile "./spec/fixtures/stylesheets/stylus.styl", (error, result) ->
        expect(result).toEqual fs.readFileSync("./spec/fixtures/stylesheets/stylus.css", 'utf8')
        
  describe "jade", ->
    it "should compile jade", ->
      template = new Metro.Template.Jade
      template.compile "./spec/fixtures/views/jade.jade", (error, result) ->
        expect(result).toEqual fs.readFileSync("./spec/fixtures/views/jade.html", 'utf8')
  
  describe "haml", ->
    it "should compile haml", ->
      template = new Metro.Template.Haml
      template.compile "./spec/fixtures/views/haml.haml", (error, result) ->
        expect(result).toEqual fs.readFileSync("./spec/fixtures/views/haml.html", 'utf8')
  
  describe "ejs", ->
    it "should compile ejs", ->
      template = new Metro.Template.Ejs
      template.compile "./spec/fixtures/views/ejs.ejs", {locals: {name: "My Name"}}, (error, result) ->
        expect(result).toEqual fs.readFileSync("./spec/fixtures/views/ejs.html", 'utf8')