
Tower.Router = Ember.Router.extend({
  urlForEvent: function(eventName) {
    var path;
    path = this._super(eventName);
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
    if (action === 'show' || action === 'destroy' || action === 'update') {
      route += ':id';
    } else if (action === 'edit') {
      route += ':id/edit';
    }
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
  insertRoute: function(route) {
    var controllerName, i, methodName, myAction, n, path, r, routeName, s, state, states;
    if (route.state) {
      path = route.state;
    } else {
      path = [];
      route.path.replace(/\/([^\/]+)/g, function(_, $1) {
        return path.push($1.split('.')[0]);
      });
      path = path.join('.');
    }
    if (!path || path === "") {
      return void 0;
    }
    r = path.split('.');
    state = this.root;
    controllerName = route.controller.name;
    i = 0;
    n = r.length;
    while (i < n) {
      states = Ember.get(state, 'states');
      if (!states) {
        states = {};
        Ember.set(state, 'states', states);
      }
      s = Ember.get(states, r[i]);
      if (s) {
        state = s;
      } else {
        routeName = '/';
        if ((r[i] === r[0] || r[i] === 'new') && r[i] !== 'root') {
          routeName += r[i];
        }
        if (!controllerName.toLowerCase().match(r[i])) {
          methodName = r[i] + _.singularize(_.camelize(controllerName.replace('Controller', '')));
          Tower.router.root[methodName] = Ember.State.transitionTo(r.join('.'));
          Tower.router.root.eventTransitions[methodName] = r.join('.');
        }
        myAction = r[i];
        if (route.options.action != null) {
          myAction = route.options.action;
        }
        s = this.createControllerActionState(controllerName, myAction, routeName);
        state.setupChild(states, r[i], s);
        state = s;
      }
      i++;
    }
    return void 0;
  }
});

Tower.router = Tower.Router.PrototypeMixin.mixins[Tower.Router.PrototypeMixin.mixins.length - 1].properties;
