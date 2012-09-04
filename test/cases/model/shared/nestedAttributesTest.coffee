describe 'Tower.ModelNestedAttributes', ->
  record = null

  class App.NestedModelTest extends Tower.Model
    @hasMany 'posts'
    @hasOne 'address'
    @belongsTo 'user'

    @acceptsNestedAttributesFor 'posts'

  beforeEach ->
    record = App.NestedModelTest.build()

  test 'should set autosave == true', ->
    assert.isTrue App.NestedModelTest.relation('posts').autosave

  test 'method definition', ->
    # might want to make this a computed setter instead
    assert.equal typeof(record.postsAttributes), 'function'

  test '_callRejectIf', ->
    # record._callRejectIf

  test '_assignToOrMarkForDestruction', ->

  test '_hasDestroyFlag', ->
    assert.isFalse record._hasDestroyFlag({})
    assert.isTrue record._hasDestroyFlag(_destroy: 'true')

  test '_unassignableKeys', ->
    assert.deepEqual record._unassignableKeys(withoutProtection: true), ['_destroy']
    assert.deepEqual record._unassignableKeys({}), ['id', '_destroy']

  test 'record.hasManyAttributes', ->
    assert.isArray record.postsAttributes({title: 'Nested Post!'})
