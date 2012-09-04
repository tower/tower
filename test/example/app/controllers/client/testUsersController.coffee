class App.TestUsersController extends Tower.Controller
  @resource 'user'

  @scope 'all'#, App.User # App.getPath('testUsersController.all')
