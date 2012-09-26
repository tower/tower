var _,
  __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

_ = Tower._;

/*
class App.Ability extends Tower.Ability
  assign: ->
    user = @get('user')
    
    @can 'read', App.Post
    # in this case you might not check for it, so you don't need to make the db call,
    # should do lazy loading with a function
    # @todo should be able to do this but can't
    # @can 'update', user.get('groups')
    # hasManyThrough.appendFindConditions is the issue.
    @can 'update', user.get('groups').all()
    @can 'manage', user.get('memberships')
    # @todo 'create' actions should add id to cursor.
    @can 'read', 'create', App.Membership
    #if user.hasRole('admin')
    #  @
    @
*/


Tower.Ability = (function(_super) {
  var Ability;

  function Ability() {
    return Ability.__super__.constructor.apply(this, arguments);
  }

  Ability = __extends(Ability, _super);

  __defineProperty(Ability,  "rules", Ember.computed(function() {
    return [];
  }).cacheable());

  __defineProperty(Ability,  "actions", {
    read: ['index', 'show'],
    create: ['new', 'create'],
    update: ['edit', 'update'],
    modify: ['update', 'destroy'],
    manage: ['create', 'read', 'modify']
  });

  __defineProperty(Ability,  "action", function() {
    var actions, args, array, options, _name;
    args = _.flatten(_.args(arguments));
    options = _.extractOptions(args);
    actions = this.get('actions');
    array = actions[_name = options.to] || (actions[_name] = []);
    actions[options.to] = array.concat(args);
    return this;
  });

  __defineProperty(Ability,  "authorize", function(action, subject, callback) {
    return this._testRules(action, subject, callback);
  });

  __defineProperty(Ability,  "can", function() {
    var actions, scopes, stripArgs,
      _this = this;
    actions = [];
    scopes = [];
    stripArgs = function(args) {
      var arg, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        if (typeof arg === 'string') {
          if (arg === 'all') {
            scopes.push(arg);
            break;
          } else {
            _results.push(actions.push(arg));
          }
        } else if (_.isArray(arg)) {
          if (arg.isCursor) {
            _results.push(scopes.push(_this._extractScopes(arg)));
          } else {
            _results.push(stripArgs(arg));
          }
        } else {
          _results.push(scopes.push(_this._extractScopes(arg)));
        }
      }
      return _results;
    };
    stripArgs(arguments);
    actions = _.uniq(this._expandActions(actions, _.extend({}, this.get('actions'))));
    this.get('rules').push({
      actions: actions,
      scopes: scopes
    });
    return this;
  });

  __defineProperty(Ability,  "_testRules", function(action, subject, callback) {
    var _this = this;
    return _.any(this.get('rules'), function(rule) {
      return _this._testRule(rule, action, subject);
    });
  });

  __defineProperty(Ability,  "_testRule", function(rule, action, subject) {
    return this._ruleMatchesAction(rule, action) && this._ruleMatchesSubject(rule, subject);
  });

  __defineProperty(Ability,  "_ruleMatchesAction", function(rule, action) {
    return _.include(rule.actions, action);
  });

  __defineProperty(Ability,  "_ruleMatchesSubject", function(rule, subject) {
    return _.any(rule.scopes, function(scope) {
      if (scope === 'all') {
        return true;
      } else if (subject instanceof Tower.Model) {
        return subject.constructor.className() === scope.model.className() && scope.test(subject);
      } else {
        return scope.model.className() === subject.className();
      }
    });
  });

  __defineProperty(Ability,  "_expandActions", function(actions, set) {
    var action, expandedActions, _i, _len;
    for (_i = 0, _len = actions.length; _i < _len; _i++) {
      action = actions[_i];
      expandedActions = set[action];
      if (!expandedActions) {
        continue;
      }
      delete set[action];
      actions = actions.concat(this._expandActions(expandedActions, set));
    }
    return actions;
  });

  __defineProperty(Ability,  "_extractScopes", function(scope) {
    if (!scope) {
      throw new Error('Ability rule cannot have a null scope');
    }
    if (scope === 'all') {
      return scope;
    } else if (_.isArray(scope)) {
      if (scope.isCursor) {
        scope.compile();
        return scope;
      } else {
        return _.map(scope, this._extractScopes);
      }
    } else if (scope instanceof Tower.Model) {
      return scope.constructor.scoped().where({
        id: scope.get('id')
      });
    } else if (_.isFunction(scope)) {
      scope = scope.scoped().cursor;
      scope.compile();
      return scope;
    } else if (scope instanceof Tower.ModelScope) {
      scope = scope.cursor;
      scope.compile();
      return scope;
    } else {
      throw new Error('Ability rule cannot have this scope: ' + _.stringify(scope));
    }
  });

  return Ability;

})(Tower.Class);

module.exports = Tower.Ability;
