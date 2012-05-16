
Tower.stateManager = Ember.StateManager.create({
  initialState: 'root',
  root: Ember.State.create(),
  handleUrl: function(url, options) {
    var route;
    route = Tower.HTTP.Route.find(url);
    if (route) {
      return Tower.stateManager.goToState(route.state);
    } else {
      return console.log("No route for " + url);
    }
  },
  createControllerActionState: function(name, action) {
    name = Tower.Support.String.camelize(name, true);
    return Ember.State.create({
      enter: function(manager, transition) {
        var app, controller, controllerAction;
        this._super(manager, transition);
        console.log("enter: " + this.name);
        app = Tower.Application.instance();
        controller = Ember.get(app, name);
        if (controller) {
          controllerAction = controller[action];
          switch (typeof controllerAction) {
            case 'object':
              if (controllerAction.enter) {
                return controllerAction.enter.call(controller);
              }
              break;
            case 'function':
              return controllerAction.call(controller);
          }
        }
      },
      exit: function(manager, transition) {
        var app, controller, controllerAction;
        this._super(manager, transition);
        console.log("exit: " + this.name);
        app = Tower.Application.instance();
        controller = Ember.get(app, name);
        if (controller) {
          controllerAction = controller[action];
          switch (typeof controllerAction) {
            case 'object':
              if (controllerAction.exit) {
                return controllerAction.exit.call(controller);
              }
          }
        }
      }
    });
  },
  insertRoute: function(route) {
    var i, n, path, r, s, state, states;
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
    state = this;
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
        s = this.createControllerActionState(route.controller.name, r[i]);
        state.setupChild(states, r[i], s);
        state = s;
      }
      i++;
    }
    return void 0;
  }
});
