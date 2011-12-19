require './helper'

describe "views", ->
  describe "configuration", ->
    
  describe "templates", ->
    beforeEach ->
      Coach.View.engine = "jade"
      Coach.View.store().loadPaths = ["spec/spec-app/app/views"]
    
    it "should lookup templates", ->
      template = Coach.View.store().findPath(path: "posts/edit")
      expect(template).toEqual "spec/spec-app/app/views/posts/edit.jade"
      expect(Coach.View.store().records["posts/edit"]).toEqual template
      
    it "should render", ->
      view    = new Coach.View
      view.render template: "posts/edit", locals: title: "First Commit", (error, result) ->
        expect(result).toEqual '<form action="/posts/1"><label>Title</label><input type="text" name="title" value="First Commit"/></form>'
       
      controller = new Coach.Controller
      controller.render "posts/edit", locals: title: "First Commit", (error, result) ->
        expect(result).toEqual '<form action="/posts/1"><label>Title</label><input type="text" name="title" value="First Commit"/></form>'
###
  describe "helpers", ->
    it "should have stylesheet helpers", ->
      view    = new Coach.View.Base
      view.locals = _.extend({}, new Coach.View.Helpers)
      result  = view.render "posts/show"
      expect(result).toEqual '<link href="application.css"></link>'
      
    it "should have stylesheet helpers from controller", ->
      controller  = new SessionsController
      result      = controller.render "posts/show"
      expect(result).toEqual '<link href="application.css"></link>'
###
