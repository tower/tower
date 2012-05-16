
Tower.HTTP.Route.DSL.prototype.match = function() {
  var route;
  this.scope || (this.scope = {});
  route = new Tower.HTTP.Route(this._extractOptions.apply(this, arguments));
  Tower.stateManager.insertRoute(route);
  return Tower.HTTP.Route.create(route);
};
