require '../config'

describe 'Tower.Controller', ->
  test 'PostsController#resourceName', ->
    controller = new TowerSpecApp.PostsController
    expect(controller.resourceName).toEqual "post"
    expect(controller.collectionName).toEqual "posts"
    expect(controller.resourceType).toEqual "Post"