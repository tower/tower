class App.Validatable extends Tower.Model
  # presence
  @field 'string_requiredTrue', required: true
  
  @field 'string_presenceTrue'
  @validates 'string_presenceTrue', presence: true
  
  # format
  @field 'string_format_a_z', format: /^[a-z]/
  @field 'string_formatEmail', format: 'email'
  @field 'string_formatPhone', format: 'phone'
  @field 'string_formatSlug', format: 'slug'
  @field 'string_formatCreditCard', format: 'creditCard'
  @field 'string_formatPostalCode', format: 'postalCode'
  
  @field 'string_format_withOption', format: value: /^\d+$/
  
  # date
  @field 'date_gte',  type: 'Date', '>=': -> _(20).days().ago().toDate()
  @field 'date_gt',   type: 'Date', '>': -> _(20).days().ago().toDate()
  @field 'date_lte',  type: 'Date', '<=': -> _(20).days().ago().toDate()
  @field 'date_lt',   type: 'Date', '<': -> _(20).days().ago().toDate()
  
  # integer
  @field 'integer_min', type: 'Integer', min: 5
  @field 'integer_max', type: 'Integer', max: 12
  @field 'integer_minFunction', type: 'Integer', min: -> 5
  # @field 'integer_lengthWithMinOption', type: 'Integer', length: min: 5
  
  # enumerables
  @field 'string_in', in: ['male', 'female']
  @field 'string_notIn', notIn: ['male', 'female']
  
  # multiple
  @field 'onCreate_all1'
  @field 'onCreate_all2'
  @validates 'onCreate_all1', 'onCreate_all2', presence: true, format: /^[a-z]+$/, on: "create"
  
  @field 'onCreate_one1'
  @field 'onCreate_one2'
  @validates 'onCreate_one1', 'onCreate_one2', presence: true, format: value: /^[a-z]+$/, on: "create"
  
  @field 'if_and_unless1'
  @field 'if_and_unless2'
  @validates 'if_and_unless1', 'if_and_unless2',
    presence:
      if:     'ifAndUnlessPresenceCheck'
    format:   
      value:  /^[a-z]+$/
      on:     "create"
      unless: 'ifAndUnlessFormatCheck'
  
  ifAndUnlessPresenceCheck: -> 
    @_ifAndUnlessPresenceCheck
  
  ifAndUnlessFormatCheck: ->
    @_ifAndUnlessFormatCheck
  
  @field 'if_global1'
  @field 'if_global2'
  @validates 'if_global1', 'if_global2', presence: true, format: /^[a-z]+$/, if: 'ifGlobal'
  
  ifGlobal: ->
    @_ifGlobal