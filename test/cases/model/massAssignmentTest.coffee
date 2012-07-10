describe 'Tower.Model.MassAssignment', ->
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
      record.set('attributes', a: 1, b: 2, c: 3)
      assert.deepEqual record.get('attributes'), {a: 1, c: 3}
      assert.equal record.get('a'), 1
      assert.notEqual record.get('b'), 2
      assert.equal record.get('c'), 3

      # record = App.ModelWithProtectedAttributes.build()
      # record.set('attributes', a: '1', id: '10')

      console.log App.ModelWithProtectedAttributes.protectedAttr()