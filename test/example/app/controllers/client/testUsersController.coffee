class App.TestUsersController extends App.ApplicationController
  @resource 'user'

  @scope 'all', App.User # App.getPath('testUsersController.all')
