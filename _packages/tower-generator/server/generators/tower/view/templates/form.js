<%= app.namespace %>.<%= model.classNamePlural %>EditView = Ember.View.extend({
  templateName: '<%= view.directory %>/edit',
  resourceBinding: 'controller.resource',
  // You can also use an object controller (Ember.ObjectProxy) 
  // as a layer between the view and the model if you'd like more control.
  // resourceControllerBinding: 'controller.resourceController'
  
  submit: function(event) {
    // @todo
    // if (this.get('resource.isNew'))
    //   this.get('controller.target').send('create<%= model.className %>');
    // else
    //   this.get('controller.target').send('update<%= model.className %>', this.get('resource'));
    this.get('resource').save();
    Tower.router.transitionTo('<%= model.namePlural %>.index');
    return false;
  }
});
