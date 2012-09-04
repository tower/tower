describe 'Tower.ModelMassAssignment', ->
  class App.ModelWithProtectedAttributes extends Tower.Model
    @field 'a', type: 'Integer'
    @field 'b', type: 'Integer'
    @field 'c', type: 'Integer'

    @protected 'b'

  describe 'Tower.Model.protected', ->
    test 'class-level protected attributes hash', ->
      assert.isTrue _.include App.ModelWithProtectedAttributes.activeAuthorizer()['default'], 'b'

    test '#_sanitizeForMassAssignment', ->
      record = App.ModelWithProtectedAttributes.build()
      record.assignAttributes(a: 1, b: 2, c: 3)
      assert.deepEqual record.get('attributes'), {a: 1, c: 3, id: undefined, b: undefined}
      assert.equal record.get('a'), 1
      assert.notEqual record.get('b'), 2
      assert.equal record.get('c'), 3

      record = App.ModelWithProtectedAttributes.build()
      record.assignAttributes(a: 1, id: '10')
      assert.deepEqual record.get('attributes'), {a: 1, c: undefined, id: undefined, b: undefined}
      assert.deepEqual record.attributesForCreate(), {a: 1}

    test '#assignAttributes', ->
      record = App.ModelWithProtectedAttributes.build()
      record.assignAttributes(id: '10', a: 1, $set: {b: 2, c: 3})
      assert.deepEqual record.attributesForCreate(), {a: 1, c: 3}

    test '.build', ->
      record = App.ModelWithProtectedAttributes.build(id: '10', a: 1, $set: {b: 2, c: 3})
      assert.deepEqual record.attributesForCreate(), {a: 1, c: 3}
      record.set('b', 2) # but you can manually set it
      assert.deepEqual record.attributesForCreate(), {a: 1, b: 2, c: 3}