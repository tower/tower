require('../lib/metro')
require('./secrets')

Metro.root        = process.cwd() + "/spec/spec-app"
Metro.public_path = Metro.root + "/public"

SpecHelper = 
  toRespondWith: (request, response) ->
    new Metro.Spec.Http(Metro.Application.instance())
  
  toHaveCSS: (options) ->
    css = @actual.cssHash()
    _.each options, (value, key) ->
      expect(css[key]).toEqual value
    true
  
  toHaveValue: (value) ->
    expect($.trim(@actual.val())).toEqual value
    true
  
  toHaveText: (value) ->
    expect($.trim(@actual.text())).toEqual value
    true
    
  toHaveState: (options) ->
    el = @actual
    _.each options, (value, key) ->
      expect(el.is(":#{key}")).toEqual value
    true
  
  toHaveAttributes: (options) ->
    el = @actual
    _.each options, (value, key) ->
      expect(el.attr(key)).toEqual value
    true
  
  toHaveClass: (string) ->
    @actual.hasClass(string)
    
  toBeNavItem: (options) ->
    expect(@actual).toBeElement(options.outer) if options.outer?
    expect(@actual.children()).toBeElement(options.inner) if options.inner?
    true
    
  toBeElement: (options) ->
    options ?= {}
    expect(@actual.length).toBeGreaterThan 0
    expect(@actual).toHaveCSS(options.css) if options.css?
    expect(@actual).toHaveAttributes(options.attributes) if options.attributes?
    expect(@actual).toHaveText(options.text) if options.text != undefined
    expect(@actual).toHaveState(options.state) if options.state?
    expect(@actual).toHaveClass(options.class) if options.class?
    true
  
  # pass it a spine.js model  
  toBeDealItemView: (deal, options) ->
    vendor = deal.vendor
    
  toBeVendorPopupView: (vendor, options) ->
    @
    
  toFillInWith: (value) ->
    @actual.focus()
    @actual.val(value)
    expect(@actual.val()).toEqual value
    true
  
  ###  
  field:
    css: hash
    attributes: hash
  label:
    css: hash
    text: string
    attributes: hash
  input:
    css: hash
    value: string
    attributes: hash
  ###
  toBeField: (options) ->
    expect(@actual).toBeElement(options.field) if options.field?
    expect($("label span", @actual)).toBeElement(options.label) if options.label?
    expect($(".input", @actual)).toBeElement(options.input) if options.input?
    true

beforeEach ->
  @addMatchers(SpecHelper)