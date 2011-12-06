require './helper'

describe "views", ->
  describe "configuration", ->
    
  describe "templates", ->
    beforeEach ->
      Metro.View.engine = "jade"
      Metro.View.store().loadPaths = ["spec/spec-app/app/views"]
    
    it "should lookup templates", ->
      template = Metro.View.store().findPath(path: "posts/edit")
      expect(template).toEqual "spec/spec-app/app/views/posts/edit.jade"
      expect(Metro.View.store().records["posts/edit"]).toEqual template
      
    it "should render", ->
      view    = new Metro.View
      view.render template: "posts/edit", locals: title: "First Commit", (error, result) ->
        expect(result).toEqual '<form action="/posts/1"><label>Title</label><input type="text" name="title" value="First Commit"/></form>'
       
      controller = new Metro.Controller
      controller.render "posts/edit", locals: title: "First Commit", (error, result) ->
        expect(result).toEqual '<form action="/posts/1"><label>Title</label><input type="text" name="title" value="First Commit"/></form>'
###
  describe "helpers", ->
    it "should have stylesheet helpers", ->
      view    = new Metro.View.Base
      view.locals = _.extend({}, new Metro.View.Helpers)
      result  = view.render "posts/show"
      expect(result).toEqual '<link href="application.css"></link>'
      
    it "should have stylesheet helpers from controller", ->
      controller  = new SessionsController
      result      = controller.render "posts/show"
      expect(result).toEqual '<link href="application.css"></link>'
###
