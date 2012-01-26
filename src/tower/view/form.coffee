class Tower.View.Form extends Tower.View.Component
  constructor: (args, options) ->
    super
    
    @model      = args.shift()
    
    if typeof @model == "string"
      klass     = Tower.constant(Tower.Support.String.camelize(@model))
      @model    = if klass then new klass else null
    
    @attributes = @_extractAttributes(args.pop())
  
  render: (callback) ->
    @tag "form", @attributes, =>
      @tag "input", type: "hidden", name: "_method", value: @attributes["data-method"]
      if callback
        builder    = new Tower.View.Form.Builder([], 
          template:   @template
          tabindex:   1
          accessKeys: {}
          model:      @model
        )
        builder.render(callback)
  
  _extractAttributes: (options = {}) ->
    attributes                  = options.html || {}
    attributes.action           = options.url
    attributes.class            = options["class"] if options.hasOwnProperty("class")
    #@mergeClass attributes, config.formClass
    attributes.id               = options.id if options.hasOwnProperty("id")
    attributes.enctype          = "multipart/form-data" if (options.multipart || attributes.multipart == true)
    attributes.role             = "form"
    attributes.novalidate       = "true" # needs to be true b/c the error popups are horribly ugly!# if options.validate == false
    attributes["data-validate"] = options.validate.toString() if options.hasOwnProperty("validate")
    
    method                      = attributes.method || options.method
    
    if !method || method == ""
      if @model && @model.isNew()
        method                 = "post"
      else
        method                 = "post"
    
    attributes["data-method"] = method
    attributes.method        = if method == "get" then "get" else "post" 
    
    attributes   

require './form/builder'
require './form/fieldset'
require './form/field'

module.exports = Tower.View.Form
