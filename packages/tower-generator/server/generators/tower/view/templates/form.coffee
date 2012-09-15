<%= app.namespace %>.<%= model.classNamePlural %>EditView = Ember.View.extend
  templateName: '<%= view.directory %>/edit'
  resourceBinding: 'controller.resource'
  # You can also use an object controller (Ember.ObjectProxy) 
  # as a layer between the view and the model if you'd like more control.
  # resourceControllerBinding: 'controller.resourceController'
  
  submit: (event) ->
    # @todo
    # if @get('resource.isNew')
    #   @get('controller.target').send('create<%= model.className %>')
    # else
    #   @get('controller.target').send('update<%= model.className %>', @get('resource'))
    @get('resource').save()
    Tower.router.transitionTo('<%= model.namePlural %>.index')
    return false
