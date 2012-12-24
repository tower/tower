
scope     = null
criteria  = null
user      = null
record    = null

describe 'Tower.ModelValidation', ->
  beforeEach (done) ->
    user    = App.User.build()
    user.set('id', 1)
    record  = App.Validatable.build()

    done()

  it 'should be invalid', ->
    assert.deepEqual user.validate(), false

    assert.deepEqual user.get('errors').firstName, ["firstName can't be blank"]

    user.set "firstName", "Joe"

    assert.deepEqual user.validate(), true
    assert.deepEqual user.get('errors'), []

    user.set "firstName", null

    assert.deepEqual user.validate(), false

    assert.deepEqual user.get('errors').firstName, ["firstName can't be blank"]

  it 'should validate from attribute definition', ->
    page = App.Page.build(title: "A App.Page")

    assert.deepEqual page.validate(), false
    assert.deepEqual page.get('errors').rating, ['rating must be a minimum of 0', 'rating must be a maximum of 10' ]

    page.set "rating", 10

    page.validate()

    assert.deepEqual page.validate(), true
    assert.deepEqual page.get('errors'), []

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
      assert.equal validator.validate(record, 'string_format_a_z', record.get('errors')), true

      record.set 'string_format_a_z', '1asdf'
      assert.equal validator.validate(record, 'string_format_a_z', record.get('errors')), false

    test 'field "name", format: "email"', ->
      field       = App.Validatable.fields()["string_formatEmail"]
      validators  = field.validators()
      validator   = validators[0]

      assert.equal validator.value, "email"

      record.set 'string_formatEmail', 'example@example.com'

      assert.equal validator.validate(record, 'string_formatEmail', record.get('errors')), true

      record.set 'string_formatEmail', 'example.com'

      assert.equal validator.validate(record, 'string_formatEmail', record.get('errors')), false

    test 'field "name", format: "phone"', ->
      validator   = App.Validatable.validators("string_formatPhone")[0]

      record.set 'string_formatPhone', '123 456 7890'
      assert.equal validator.validate(record, 'string_formatPhone', record.get('errors')), true

      record.set 'string_formatPhone', '123'
      assert.equal validator.validate(record, 'string_formatPhone', record.get('errors')), false

    test 'field "name", format: "slug"', ->
      validator   = App.Validatable.validators("string_formatSlug")[0]

      record.set 'string_formatSlug', 'a-slug'
      assert.equal validator.validate(record, 'string_formatSlug', record.get('errors')), true

      record.set 'string_formatSlug', 'a slug'
      assert.equal validator.validate(record, 'string_formatSlug', record.get('errors')), false

    test 'field "name", format: "creditCard"', ->
      validator   = App.Validatable.validators("string_formatCreditCard")[0]

      record.set 'string_formatCreditCard', '4111111111111111'
      assert.equal validator.validate(record, 'string_formatCreditCard', record.get('errors')), true

      record.set 'string_formatCreditCard', '4111111111111'
      assert.equal validator.validate(record, 'string_formatCreditCard', record.get('errors')), false

    test 'field "name", format: "postalCode"', ->
      validator   = App.Validatable.validators("string_formatPostalCode")[0]

      record.set 'string_formatPostalCode', '91941'
      assert.equal validator.validate(record, 'string_formatPostalCode', record.get('errors')), true

      record.set 'string_formatPostalCode', '9194'
      assert.equal validator.validate(record, 'string_formatPostalCode', record.get('errors')), false

    test 'field "name", format: value: /^\d+$/', ->
      validator   = App.Validatable.validators("string_format_withOption")[0]

      record.set 'string_format_withOption', '91941'
      assert.equal validator.validate(record, 'string_format_withOption', record.get('errors')), true

      record.set 'string_format_withOption', 'abc91941'
      assert.equal validator.validate(record, 'string_format_withOption', record.get('errors')), false

  describe 'length, min, max', ->
    test 'field "name", type: "Integer", min: 5', ->
      validator   = App.Validatable.validators("integer_min")[0]

      record.set 'integer_min', 6
      assert.equal validator.validate(record, 'integer_min', record.get('errors')), true

      record.set 'integer_min', 4
      assert.equal validator.validate(record, 'integer_min', record.get('errors')), false

    test 'field "name", type: "Integer", max: 12', ->
      validator   = App.Validatable.validators("integer_max")[0]

      record.set 'integer_max', 11
      assert.equal validator.validate(record, 'integer_max', record.get('errors')), true

      record.set 'integer_max', 13
      assert.equal validator.validate(record, 'integer_max', record.get('errors')), false

    test 'field "name", type: "Integer", min: -> 5', ->
      validator   = App.Validatable.validators("integer_minFunction")[0]

      record.set 'integer_minFunction', 6
      assert.equal validator.validate(record, 'integer_minFunction', record.get('errors')), true

      record.set 'integer_minFunction', 4
      assert.equal validator.validate(record, 'integer_minFunction', record.get('errors')), false

  describe 'date', ->
    test 'field "name", type: "Date", ">=": -> _(20).days().ago()', ->
      validator   = App.Validatable.validators("date_gte")[0]

      record.set 'date_gte', new Date
      assert.equal validator.validate(record, 'date_gte', record.get('errors')), true

      record.set 'date_gte', _(100).days().ago().toDate()
      assert.equal validator.validate(record, 'date_gte', record.get('errors')), false

    test 'field "name", type: "Date", "<": -> _(20).days().ago()', ->
      validator   = App.Validatable.validators("date_lt")[0]

      record.set 'date_lt', _(100).days().ago().toDate()
      assert.equal validator.validate(record, 'date_lt', record.get('errors')), true

      record.set 'date_lt', _(5).days().ago().toDate()
      assert.equal validator.validate(record, 'date_lt', record.get('errors')), false

  describe 'enumerable', ->
    test 'field "name", in: ["male", "female"]', ->
      validator   = App.Validatable.validators("string_in")[0]

      record.set 'string_in', 'male'
      assert.equal validator.validate(record, 'string_in', record.get('errors')), true

      record.set 'string_in', 'random'
      assert.equal validator.validate(record, 'string_in', record.get('errors')), false

    test 'field "name", notIn: ["male", "female"]', ->
      validator   = App.Validatable.validators("string_notIn")[0]

      record.set 'string_notIn', 'random'
      assert.equal validator.validate(record, 'string_notIn', record.get('errors')), true

      record.set 'string_notIn', 'male'
      assert.equal validator.validate(record, 'string_notIn', record.get('errors')), false

  describe 'multiple fields at once', ->
    test 'field "name", "name2", presence: true, format: /^[a-z]+/, on: "create"', ->
      a   = App.Validatable.validators("onCreate_all1")
      b   = App.Validatable.validators("onCreate_all2")
      all = _.flatten(a, b)

      assert.equal a.length, 2
      assert.equal a.length, b.length

      for validator in all
        assert.equal validator.options.on, "create"

    test 'field "name", "name2", presence: true, format: value: /^[a-z]+/, on: "create"', ->
      a       = App.Validatable.validators("onCreate_one1")
      b       = App.Validatable.validators("onCreate_one2")
      all     = _.flatten(a, b)

      assert.equal a.length, 2
      assert.equal a.length, b.length

      formatValidators    = _.select all, (validator) -> validator.name == "format"
      presenceValidators  = _.select all, (validator) -> validator.name == "presence"

      for formatValidator in formatValidators
        assert.equal formatValidator.options.on, "create"

      for presenceValidator in presenceValidators
        assert.equal presenceValidator.options.on, undefined

    test 'field "name", "name2", presence: {if: "method"}, format: unless: "method", value: /^[a-z]+/, on: "create"', ->
      a       = App.Validatable.validators("if_and_unless1")
      b       = App.Validatable.validators("if_and_unless2")
      all     = _.flatten(a, b)

      assert.equal a.length, 2
      assert.equal a.length, b.length

      formatValidators    = _.select all, (validator) -> validator.name == "format"
      presenceValidators  = _.select all, (validator) -> validator.name == "presence"

      for formatValidator in formatValidators
        assert.equal formatValidator.options.on, "create"
        assert.equal formatValidator.options.unless, "ifAndUnlessFormatCheck"

        record.set 'if_and_unless1', 'asdf'
        record._ifAndUnlessFormatCheck = false
        assert.equal formatValidator.validateEach(record, record.get('errors')), true
        record._ifAndUnlessFormatCheck = true
        assert.equal formatValidator.validateEach(record, record.get('errors')), false

      for presenceValidator in presenceValidators
        assert.equal presenceValidator.options.on, undefined
        assert.equal presenceValidator.options.if, 'ifAndUnlessPresenceCheck'

        record.set 'if_and_unless1', 'asdf'
        record._ifAndUnlessPresenceCheck = true
        assert.equal presenceValidator.validateEach(record, record.get('errors')), true
        record._ifAndUnlessPresenceCheck = false
        assert.equal presenceValidator.validateEach(record, record.get('errors')), false

    test 'field "name", "name2", presence: true, format: /^[a-z]+/, if: "method"', ->
      a       = App.Validatable.validators("if_global1")
      b       = App.Validatable.validators("if_global2")
      all     = _.flatten(a, b)

      assert.equal a.length, 2
      assert.equal a.length, b.length

      for validator in all
        record.set 'if_global1', 'asdf'
        record._ifGlobal = true
        assert.equal validator.validateEach(record, record.get('errors')), true
        record._ifGlobal = false
        assert.equal validator.validateEach(record, record.get('errors')), false

  describe 'confirmation', ->
    test 'field "name", confirmation: true', ->
      field       = App.Validatable.fields().string_confirmationTrue
      validators  = field.validators()
      validator  = validators[0]

      record.set 'string_confirmationTrue', 'asdf'
      record.set 'string_confirmationTrueConfirmation', 'asdf'
      assert.equal validator.validate(record, 'string_confirmationTrue', record.get('errors')), true

      record.set 'string_confirmationTrue', 'asdf'
      record.set 'string_confirmationTrueConfirmation', 'not asdf'
      assert.equal validator.validate(record, 'string_confirmationTrue', record.get('errors')), false

      assert.deepEqual record.get('errors').string_confirmationTrue, ["string_confirmationTrue doesn't match confirmation"]
