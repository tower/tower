class App.ControllerScopesMetdataController extends Tower.Controller
  @resource 'post'

  currentUser: Ember.computed ->
    user = App.User.build()
    user.set('id', 5)
    user
