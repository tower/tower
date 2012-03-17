
Tower.Controller.Redirecting = {
  redirectTo: function() {
    return this.redirect.apply(this, arguments);
  },
  redirect: function() {
    var args, options, url;
    try {
      args = Tower.Support.Array.args(arguments);
      options = Tower.Support.Array.extractOptions(args);
      url = args.shift();
      if (!url && options.hasOwnProperty("action")) {
        url = (function() {
          switch (options.action) {
            case "index":
            case "new":
              return Tower.urlFor(this.resourceType, {
                action: options.action
              });
            case "edit":
            case "show":
              return Tower.urlFor(this.resource, {
                action: options.action
              });
          }
        }).call(this);
      }
      url || (url = "/");
      this.response.redirect(url);
    } catch (error) {
      console.log(error);
    }
    if (this.callback) return this.callback();
  }
};

module.exports = Tower.Controller.Redirecting;
