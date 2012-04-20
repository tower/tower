
Tower.Controller.Redirecting = {
  InstanceMethods: {
    redirectTo: function() {
      return this.redirect.apply(this, arguments);
    },
    redirect: function() {
      var args, options, url;
      try {
        args = _.args(arguments);
        options = _.extractOptions(args);
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
        if (options.action === 'index') {
          url = "/custom";
        } else {
          url = "/custom/1";
        }
        this.response.redirect(url);
      } catch (error) {
        console.log(error);
      }
      if (this.callback) {
        return this.callback();
      }
    }
  }
};

module.exports = Tower.Controller.Redirecting;
