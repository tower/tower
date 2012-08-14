# @todo on node ember rendering isn't yet supported
#   (this is just used for testing for now)
Ember.TEMPLATES ||= {}

Tower.View.reopen
  # findEmberView('loginView')
  # findEmberView('posts/index') => 'postsIndexView'
  findEmberViewOLD: (path) ->
    # Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(template)

    #viewName = _.camelize(path) + "View"
    #app = Tower.Application.instance()

    #if view = app.get(viewName)
    #  view
    #else if viewClass = app.get(_.camelize(viewName))
    #  view = viewClass.create()
    #  app.set(viewName, view)
    #else
    return null unless Ember.TEMPLATES.hasOwnProperty(path)
    view = Ember.View.create(templateName: path)
    #app.set(viewName, view)

    view
    
  findEmberView: (options) ->
    if options.view
      options.view
    else if options.template
      @_getEmberTemplate(options.template)
      App.get(Tower._.camelize(options.template) + 'View')

  renderEmberView: (options) ->
    @parentController().connectOutlet(@_connectOutletOptions(options))

  # Normalizes the options to be passed to `connectOutlet`.
  # 
  # @todo Need to pass in a better context hash.
  # 
  # @private
  _connectOutletOptions: (options) ->
    outletName: options.outlet || 'view' # default value in ember
    viewClass:  @findEmberView(options)
    context:    options.data || @#get('content')

  # Gets the ember template from `Ember.TEMPLATES`, which might be a computed property.
  _getEmberTemplate: (name) ->
    # either this
    if typeof Ember.TEMPLATES[name] == 'object'
      # @todo this should call the computed property value
      Ember.TEMPLATES[name] = Ember.TEMPLATES[name].func()#Ember.get(Ember.TEMPLATES, name) # so they can be lazily compiled

    Ember.TEMPLATES[name]

    # or this
    # Ember.TEMPLATES[name] = Ember.Handlebars.compile(Tower.View.cache[name])