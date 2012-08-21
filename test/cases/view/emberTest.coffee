describe 'Tower Ember View rendering', ->
  view = null

  before ->
    require(process.cwd() + '/packages/tower-view/client/emberHelper')

    Ember.TEMPLATES['some'] = -> 'some!'
    Ember.TEMPLATES['another/path'] = -> 'another/path!'
    Ember.TEMPLATES['computed/template'] = Ember.computed(-> 'computed/template!')

    # @todo stub out actual getting ember view for now
    #Tower.View.reopen
    #  findEmberView: (options) ->

  beforeEach ->
    view = new Tower.View #Tower.View.create()

  test '#_connectOutletOptions', ->
    assert.deepEqual view._connectOutletOptions({}),
      outletName: 'view'
      viewClass:  undefined
      # this is the view object itself, where _context is the controller
      #context:
      #  _context: {}
      controller: {}

  test '#_getEmberTemplate', ->
    assert.equal view._getEmberTemplate('computed/template'), 'computed/template!'

  #test '#_connectOutletOptions with template name', ->
  #  options = view._connectOutletOptions
  #    template: 'some'
  #
  #  # can't do this on the server now, b/c App.get is calling a router action in express...
  #  # console.log App.get('someView')
  #
  #  assert.deepEqual options,
  #    outletName: 'view'
  #    viewClass:  App.SomeView
  #    # this is the view object itself, where _context is the controller
  #    context:
  #      _context: {}    

  test '#renderEmberView', ->
    #view.renderEmberView()