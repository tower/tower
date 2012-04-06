require '../../config'

scope     = null
criteria  = null
user      = null
record    = null

describeWith = (store) ->
  describe "Tower.Model.Validation (Tower.Store.#{store.constructor.name})", ->
    beforeEach (done) ->
      App.User.store(store)
      App.Validatable.store(store)
      user    = new App.User(id: 1)
      record  = new App.Validatable()
      
      done()
    
    it 'should be invalid', ->
      assert.deepEqual user.validate(), false
      
      assert.deepEqual user.errors.firstName, ["firstName can't be blank"]
    
      user.set "firstName", "Joe"
    
      assert.deepEqual user.validate(), true
      assert.deepEqual user.errors, []
      
      user.set "firstName", null
    
      assert.deepEqual user.validate(), false
    
      assert.deepEqual user.errors.firstName, ["firstName can't be blank"]
  
    it 'should validate from attribute definition', ->
      page = new App.Page(title: "A App.Page")
      
      assert.deepEqual page.validate(), false
      assert.deepEqual page.errors.rating, ['rating must be a minimum of 0', 'rating must be a maximum of 10' ]
    
      page.set "rating", 10
      
      page.validate()
      
      assert.deepEqual page.validate(), true
      assert.deepEqual page.errors, []
      
    describe 'presence', ->
      test 'field "name", required: true', ->
        field       = App.Validatable.fields().string_requiredTrue
        validators  = field.validators()
        
        assert.equal validators.length, 1
        assert.equal validators[0].name, "required"
        
      test 'field "name"; @validates "name", presence: true', ->
        field       = App.Validatable.fields().string_presenceTrue
        validators  = field.validators()

        assert.equal validators.length, 1
        assert.equal validators[0].name, "presence"
        
    describe 'format', ->
      test 'field "name", format: /^[a-z]/', ->
        field       = App.Validatable.fields()["string_format_a_z"]
        validators  = field.validators()
        validator   = validators[0]
        
        assert.equal validator.value.toString(), /^[a-z]/.toString()
        
        record.set 'string_format_a_z', 'asdf'
        assert.equal validator.validate(record, 'string_format_a_z', record.errors), true
        
        record.set 'string_format_a_z', '1asdf'
        assert.equal validator.validate(record, 'string_format_a_z', record.errors), false
        
      test 'field "name", format: "email"', ->
        field       = App.Validatable.fields()["string_formatEmail"]
        validators  = field.validators()
        validator   = validators[0]
        
        assert.equal validator.value, "email"
        
        record.set 'string_formatEmail', 'example@example.com'
        assert.equal validator.validate(record, 'string_formatEmail', record.errors), true
        
        record.set 'string_formatEmail', 'example.com'
        assert.equal validator.validate(record, 'string_formatEmail', record.errors), false
        
      test 'field "name", format: "phone"', ->
        validator   = App.Validatable.validators("string_formatPhone")[0]
        
        record.set 'string_formatPhone', '123 456 7890'
        assert.equal validator.validate(record, 'string_formatPhone', record.errors), true
        
        record.set 'string_formatPhone', '123'
        assert.equal validator.validate(record, 'string_formatPhone', record.errors), false
        
      test 'field "name", format: "slug"', ->
        validator   = App.Validatable.validators("string_formatSlug")[0]
        
        record.set 'string_formatSlug', 'a-slug'
        assert.equal validator.validate(record, 'string_formatSlug', record.errors), true
        
        record.set 'string_formatSlug', 'a slug'
        assert.equal validator.validate(record, 'string_formatSlug', record.errors), false
        
      test 'field "name", format: "creditCard"', ->
        validator   = App.Validatable.validators("string_formatCreditCard")[0]
        
        record.set 'string_formatCreditCard', '4111111111111111'
        assert.equal validator.validate(record, 'string_formatCreditCard', record.errors), true
        
        record.set 'string_formatCreditCard', '4111111111111'
        assert.equal validator.validate(record, 'string_formatCreditCard', record.errors), false
        
      test 'field "name", format: "postalCode"', ->
        validator   = App.Validatable.validators("string_formatPostalCode")[0]
        
        record.set 'string_formatPostalCode', '91941'
        assert.equal validator.validate(record, 'string_formatPostalCode', record.errors), true
        
        record.set 'string_formatPostalCode', '9194'
        assert.equal validator.validate(record, 'string_formatPostalCode', record.errors), false
        
      test 'field "name", format: with: /^\d+$/', ->
        validator   = App.Validatable.validators("string_format_withOption")[0]
        
        record.set 'string_format_withOption', '91941'
        assert.equal validator.validate(record, 'string_format_withOption', record.errors), true
        
        record.set 'string_format_withOption', 'abc91941'
        assert.equal validator.validate(record, 'string_format_withOption', record.errors), false

    describe 'length, min, max', ->
    
    describe 'date', ->
      test 'field "name", type: "Date", ">=": -> _(20).days().ago()', ->
        validator   = App.Validatable.validators("date_gte")[0]
        
        record.set 'date_gte', new Date
        assert.equal validator.validate(record, 'date_gte', record.errors), true
        
        record.set 'date_gte', _(100).days().ago().toDate()
        assert.equal validator.validate(record, 'date_gte', record.errors), false
        
      test 'field "name", type: "Date", "<": -> _(20).days().ago()', ->
        validator   = App.Validatable.validators("date_lt")[0]

        record.set 'date_lt', _(100).days().ago().toDate()
        assert.equal validator.validate(record, 'date_lt', record.errors), true

        record.set 'date_lt', _(5).days().ago().toDate()
        assert.equal validator.validate(record, 'date_lt', record.errors), false
    
describeWith(Tower.Store.Memory)
describeWith(Tower.Store.MongoDB)