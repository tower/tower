<%= app.namespace %>.<%= model.classNamePlural %>EditView = Ember.View.extend
  templateName: '<%= view.directory %>/edit'
  resourceControllerBinding: 'controller.resourceController'

  submit: (event) ->
    false