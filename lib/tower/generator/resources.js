
Tower.Generator.Resources = {
  route: function(routingCode) {
    var sentinel;
    this.log("route", routingCode);
    sentinel = /\.Route\.draw do(?:\s*\|map\|)?\s*$/;
    return this.inRoot(function() {
      return this.injectIntoFile('config/routes.rb', "\n  " + routing_code + "\n", {
        after: sentinel,
        verbose: false
      });
    });
  },
  nodeModule: function(name, options) {
    if (options == null) options = {};
  }
};

module.exports = Tower.Generator.Resources;
