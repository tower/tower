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
  
  @field 'string_format_withOption', format: with: /^\d+$/
  
  # date
  @field 'date_gte',  type: "Date", ">=": -> _(20).days().ago().toDate()
  @field 'date_gt',   type: "Date", ">": -> _(20).days().ago().toDate()
  @field 'date_lte',  type: "Date", "<=": -> _(20).days().ago().toDate()
  @field 'date_lt',   type: "Date", "<": -> _(20).days().ago().toDate()