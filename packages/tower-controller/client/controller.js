var _;

_ = Tower._;

Tower.Controller.reopenClass({
  extended: function() {
    var camelName, name, object;
    object = {};
    name = this.className();
    camelName = _.camelize(name, true);
    object[camelName] = Ember.computed(function() {
      return Tower.router.get(camelName);
    }).cacheable().property('Tower.router.' + camelName);
    this.reopen({
      resourceControllerBinding: "Tower.router." + (_.singularize(camelName.replace(/Controller$/, ''))) + "Controller"
    });
    Tower.Application.instance().reopen(object);
    Tower.NetConnection.controllers.push(camelName);
    return this;
  },
  instance: function() {
    return Tower.Application.instance().get(_.camelize(this.className(), true));
  }
});
