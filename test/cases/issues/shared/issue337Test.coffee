describe 'issue337Test', ->
  before ->
    class App.Issue337NamespacedModel extends Tower.Model
    class global.Issue337GlobalModel extends Tower.Model
    class global.Event

  after ->
    delete global.Issue337GlobalModel
    delete global.Event

  test 'Tower.constant on global vs. namespaced models', ->
    assert.throws((-> Tower.constant('Issue337GlobalModel')), Error, "Constant 'Issue337GlobalModel' wasn't found")
    assert.equal 'App.Issue337NamespacedModel', Tower.constant('Issue337NamespacedModel').toString()