var __slice = [].slice;

Tower.Router = Ember.Router.extend({
  urlForEvent: function() {
    var contexts, eventName, path;
    eventName = arguments[0], contexts = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    path = this._super.apply(this, [eventName].concat(__slice.call(contexts)));
    if (path === '') {
      path = '/';
    }
    return path;
  },
  initialState: 'root',
  location: Ember.HistoryLocation.create(),
  root: Ember.Route.create({
    route: '/',
    index: Ember.Route.create({
      route: '/'
    }),
    eventTransitions: {
      showRoot: 'root.index'
    },
    showRoot: Ember.State.transitionTo('root.index')
  }),
  handleUrl: function(url, params) {
    var route;
    if (params == null) {
      params = {};
    }
    route = Tower.NetRoute.findByUrl(url);
    if (route) {
      params = route.toControllerData(url, params);
      return Tower.router.transitionTo(route.state, params);
    } else {
      return console.log("No route for " + url);
    }
  },
  createControllerActionState: function(name, action, route) {
    name = _.camelize(name, true);
    return Ember.Route.create({
      route: route,
      serialize: function(router, context) {
        var attributes;
        if (context && context.toJSON) {
          attributes = context.toJSON();
        }
        return attributes || context;
      },
      deserialize: function(router, params) {
        return params;
      },
      enter: function(router, transition) {
        var controller;
        this._super(router, transition);
        if (Tower.debug) {
          console.log("enter: " + this.name);
        }
        controller = Ember.get(Tower.Application.instance(), name);
        if (controller) {
          if (this.name === controller.collectionName) {
            return controller.enter();
          } else {
            return controller.enterAction(action);
          }
        }
      },
      connectOutlets: function(router, params) {
        var controller;
        if (Tower.debug) {
          console.log("connectOutlets: " + this.name);
        }
        controller = Ember.get(Tower.Application.instance(), name);
        if (controller) {
          if (this.name === controller.collectionName) {
            return;
          }
          controller.call(router, params);
        }
        return true;
      },
      exit: function(router, transition) {
        var controller;
        this._super(router, transition);
        if (Tower.debug) {
          console.log("exit: " + this.name);
        }
        controller = Ember.get(Tower.Application.instance(), name);
        if (controller) {
          if (this.name === controller.collectionName) {
            return controller.exit();
          } else {
            return controller.exitAction(action);
          }
        }
      }
    });
  },
  insertRoutePart: function(segment, pathPart, leaf, route, action, state) {
    var controllerName, methodName, routeName, s, states;
    controllerName = route.controller.name;
    methodName = route.options.name;
    if (leaf) {
      Tower.router.root[methodName] = Ember.State.transitionTo(route.options.state);
      Tower.router.root.eventTransitions[methodName] = route.options.state;
    } else {
      action = "find";
    }
    routeName = "/" + segment;
    states = Ember.get(state, 'states');
    if (!states) {
      states = {};
      Ember.set(state, 'states', states);
    }
    s = Ember.get(states, pathPart);
    if (!s) {
      s = this.createControllerActionState(controllerName, action, routeName);
      state.setupChild(states, pathPart, s);
    }
    return s;
  },
  insertRoute: function(route) {
    var c, controllerName, methodName, nsParts, path, pathParts, routeName, routeParts, state,
      _this = this;
    if (route.state) {
      path = route.state;
    } else {
      path = [];
      route.path.replace(/\/([^\/]+)/g, function(_, $1) {
        return path.push($1.split('.')[0]);
      });
      path = path.join('.');
    }
    if (!path || path === "" || !(route.options.action != null)) {
      return void 0;
    }
    if (!(route.options.method.indexOf("GET") > -1)) {
      return void 0;
    }
    routeName = route.options.path.replace(".:format?", "");
    state = this.root;
    if (route.options.name != null) {
      controllerName = methodName = route.options.name;
    }
    pathParts = path.split(".");
    routeParts = routeName.split("/");
    routeParts.shift();
    nsParts = routeParts.slice(0, pathParts.length - 1);
    routeParts = routeParts.slice(pathParts.length - 1);
    routeParts = routeParts.join("/");
    nsParts.push(routeParts);
    routeParts = nsParts;
    c = 0;
    pathParts.forEach(function(part) {
      var action, leaf, segment;
      segment = routeParts[c];
      c++;
      leaf = c === pathParts.length;
      action = "find";
      if (leaf) {
        action = route.options.action;
      }
      return state = _this.insertRoutePart(segment, part, leaf, route, action, state);
    });
    return void 0;
  }
});

Tower.router = Tower.Router.PrototypeMixin.mixins[Tower.Router.PrototypeMixin.mixins.length - 1].properties;
