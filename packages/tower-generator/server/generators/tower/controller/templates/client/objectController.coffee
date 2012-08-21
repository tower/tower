<%= controller.namespace %>.<%= model.className %>Controller = Ember.ObjectController.extend
  contentBinding: 'Tower.router.<%= model.namePlural %>Controller.resource'
