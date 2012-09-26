
Tower.NetRouteDSL.prototype.match = function() {
  var route;
  this.scope || (this.scope = {});
  route = new Tower.NetRoute(this._extractOptions.apply(this, arguments));
  Tower.router.insertRoute(route);
  return Tower.NetRoute.create(route);
};
