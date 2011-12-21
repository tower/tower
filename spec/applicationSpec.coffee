require './helper'

describe "application", ->
  beforeEach ->
    @application = Tower.Application.instance().initialize()
    
  it "should load routes", ->
    expect(Tower.Route.all().length).toEqual 1
    
  it "should load models", ->
    expect(TowerSpecApp.Post).toBeTruthy()
  
  it "should load controllers", ->
    expect(TowerSpecApp.ApplicationController).toBeTruthy()
    expect(TowerSpecApp.PostsController).toBeTruthy()
    
  it "should respond to requests", ->
    #console.log @application.app
    #expect(request(app)).toRespond(
    #  { url: '/login' },
    #  { body: 'blog', status: 200 }
    #)
