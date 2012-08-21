###
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
###
class Tower.Ability extends Tower.Class
  rules: Ember.computed(->
    []
  ).cacheable()

  actions:
    read:   ['index', 'show']
    create: ['new', 'create']
    update: ['edit', 'update']
    modify: ['update', 'destroy']
    manage: ['create', 'read', 'modify']

  # @example
  #   @aliasAction 'create', 'read', 'update', to: 'manage'
  action: ->
    args    = _.flatten _.args(arguments)
    options = _.extractOptions(args)
    actions = @get('actions')
    array   = actions[options.to] ||= []
    actions[options.to] = array.concat(args)
    @

  authorize: (action, subject, callback) ->
    @_testRules(action, subject, callback) # @todo possibility this will be async

  # Maps an action to a scope (converting non-scopes to scopes as well)
  # 
  # @example
  #   @can 'read', 'create', App.Post # model class, or scope
  #   @can 'update', @user.get('posts') # association scope
  #   @can 'read', 'all' # match any model
  #   @can 'destroy', @user # single record or array of them
  can: ->
    actions = []
    scopes  = []
    # @todo make dynamic arguments cleaner
    stripArgs = (args) =>
      for arg in args
        if typeof arg == 'string'
          if arg == 'all'
            scopes.push(arg)
            break
          else
            actions.push(arg)
        else if _.isArray(arg)
          if arg.isCursor
            scopes.push(@_extractScopes(arg))
          else
            stripArgs(arg)
        else
          scopes.push(@_extractScopes(arg))

    stripArgs(arguments)

    actions = _.uniq @_expandActions(actions, _.extend({}, @get('actions')))
    # scopes  = _.castArray(@_extractScopes(scope))
    # scopes  = [scopes] if scopes.isCursor # since scopes are arrays
    @get('rules').push(actions: actions, scopes: scopes)
    @

  _testRules: (action, subject, callback) ->
    _.any @get('rules'), (rule) => @_testRule(rule, action, subject)

  _testRule: (rule, action, subject) ->
    @_ruleMatchesAction(rule, action) && @_ruleMatchesSubject(rule, subject)

  _ruleMatchesAction: (rule, action) ->
    _.include(rule.actions, action)

  _ruleMatchesSubject: (rule, subject) ->
    _.any rule.scopes, (scope) ->
      if scope == 'all'
        true
      else if subject instanceof Tower.Model
        # @todo need to add sti to cursor.test
        subject.constructor.className() == scope.model.className() && scope.test(subject)
      else # for now assuming it's a class
        scope.model.className() == subject.className()

  # @todo a better algorithm
  _expandActions: (actions, set) ->
    for action in actions
      expandedActions = set[action]
      continue unless expandedActions
      delete set[action]
      actions = actions.concat(@_expandActions(expandedActions, set))

    actions

  _extractScopes: (scope) ->
    throw new Error('Ability rule cannot have a null scope') unless scope

    if scope == 'all'
      scope # @todo special case
    else if _.isArray(scope) # cursor
      if scope.isCursor
        scope.compile()
        scope
      else
        _.map(scope, @_extractScopes) # array of the same things
    else if scope instanceof Tower.Model # match record id
      scope.constructor.scoped().where(id: scope.get('id'))
    else if _.isFunction(scope)
      scope = scope.scoped().cursor # tower model class, `App.Post`
      scope.compile()
      scope
    else if scope instanceof Tower.ModelScope
      scope = scope.cursor
      scope.compile()
      scope
    else
      throw new Error('Ability rule cannot have this scope: ' + _.stringify(scope))

module.exports = Tower.Ability
