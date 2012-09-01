<%= app.namespace %>.ApplicationController = Tower.Controller.extend({
  layout: 'application',
  
  params: {
    page: {type: 'Number', allowRange: false, allowNegative: false},
    limit: {type: 'Number', allowRange: false, allowNegative: false},
    createdAt: {type: 'Date'},
    updatedAt: {type: 'Date'}
  },

  welcome: function() {
    this.render('welcome', locals: {bootstrapData: bootstrapData});
  },

  // Example of how you might bootstrap a one-page application.
  bootstrap: function(callback) {
    data = this.bootstrapData = {};

    // for every model you add, you can add it to the bootstrap
    // dataset by using this async helper.
    _.series([
    ], callback);
  }
});

<%= app.namespace %>.ApplicationController.beforeAction('bootstrap');
