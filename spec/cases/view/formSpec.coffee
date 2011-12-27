require '../../config'
ck = require 'coffeekup'
fs  = require 'fs'

describe "views", ->
  describe 'form builder', ->
    it 'should render with coffeekup', ->
      expect(ck.render -> h1 "Hello World").toEqual "<h1>Hello World</h1>"
      
    it 'should render a form from a post', ->
      template  = fs.readFileSync "spec/spec-app/app/views/posts/new.coffee", "utf-8"
      post      = new Post
      
      #expect(ck.render(template, locals: {post: post}, format: true)).toEqual "<form></form>"