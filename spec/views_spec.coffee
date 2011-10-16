Metro   = require('../lib/metro')
fs      = require('fs')
_       = require('underscore')

describe "views", ->
  describe "configuration", ->
    
  describe "templates", ->
    beforeEach ->
      Metro.Views.bootstrap()
      Metro.Views.engine = "jade"
        
    it "should lookup templates", ->
      expect(Metro.Views.paths_by_name["posts/edit"]).toEqual null
      template = Metro.Views.lookup("posts/edit")
      expect(template).toEqual "spec/spec-app/app/views/posts/edit.jade"
      expect(Metro.Views.paths_by_name["posts/edit"]).toEqual template
    
    it "should render", ->
      view    = new Metro.Views.Base
      result  = view.render "posts/edit", locals: title: "First Commit"
      expect(result).toEqual '<form action="/posts/1"><label>Title</label><input type="text" name="title" value="First Commit"/></form>'
      
  describe "helpers", ->
    it "should have stylesheet helpers", ->
      view    = new Metro.Views.Base
      view.locals = _.extend({}, new Metro.Views.Helpers)
      result  = view.render "posts/show"
      expect(result).toEqual '<link href="application.css"></link>'
      
    it "should have stylesheet helpers from controller", ->
      controller  = new SessionsController
      result      = controller.render "posts/show"
      expect(result).toEqual '<link href="application.css"></link>'