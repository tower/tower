require './helper'
ck = require 'coffeekup'
fs  = require 'fs'

describe "views", ->
  describe "configuration", ->
    
  describe "templates", ->
    beforeEach ->
      Tower.View.engine = "jade"
      Tower.View.store().loadPaths = ["spec/spec-app/app/views"]
    
    it "should lookup templates", ->
      template = Tower.View.store().findPath(path: "posts/edit")
      expect(template).toEqual "spec/spec-app/app/views/posts/edit.jade"
      expect(Tower.View.store().records["posts/edit"]).toEqual template
      
    it "should render", ->
      view    = new Tower.View
      view.render template: "posts/edit", locals: title: "First Commit", (error, result) ->
        expect(result).toEqual '<form action="/posts/1"><label>Title</label><input type="text" name="title" value="First Commit"/></form>'
       
      controller = new Tower.Controller
      controller.render "posts/edit", locals: title: "First Commit", (error, result) ->
        expect(result).toEqual '<form action="/posts/1"><label>Title</label><input type="text" name="title" value="First Commit"/></form>'

  describe 'form builder', ->
    it 'should render with coffeekup', ->
      expect(ck.render -> h1 "Hello World").toEqual "<h1>Hello World</h1>"
      
    it 'should render a form from a post', ->
      template  = fs.readFileSync "spec/spec-app/app/views/posts/new.coffee", "utf-8"
      post      = new Post
      
      #expect(ck.render(template, locals: {post: post}, format: true)).toEqual "<form></form>"