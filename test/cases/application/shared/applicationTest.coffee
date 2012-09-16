describe 'Tower.Application', ->
  test 'load models', ->
    assert.isPresent !!App.Post
  
  test 'load controllers', ->
    assert.isPresent App.ApplicationController
    assert.isPresent App.PostsController
