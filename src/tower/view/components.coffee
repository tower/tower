Tower.View.Components =
  formFor: ->
    Tower.View.Components.Form.render(arguments...)

class Tower.View.Components.Form
  @render: ->
    (new @(arguments...)).render()
    
  constructor: ->
    args      = Tower.Support.Array.args(arguments)
    callback  = args.pop()
    if args[0] instanceof Tower.Model
      model   = args.shift()
    options = args.pop() || {}
    model ||= options.model
    
    @model    = model
    @options  = options
    
    attributes                  = options.html || {}
    attributes.action           = options.url
    attributes.class            = options["class"] if options.hasOwnProperty("class")
    #@mergeClass attributes, config.formClass
    attributes.id               = options.id if options.hasOwnProperty("id")
    attributes.enctype          = "multipart/form-data" if (options.multipart || attributes.multipart == true)
    attributes.role             = "form"
    attributes.novalidate       = "true" # needs to be true b/c the error popups are horribly ugly!# if options.validate == false
    attributes["data-validate"] = options.validate.toS if options.hasOwnProperty("validate")
    
    method                      = attributes.method || options.method
    
    if !method || method == ""
      if @model.isNew()
        method                 = "post"
      else
        method                 = "put"
    
    attributes["data-method"] = method
    attributes.method        = if method == "get" then "get" else "post"
    
    @attributes = attributes
    
    @render()
    
  render: ->
    form @attributes, ->
      input type: "hidden", name: "_method", value: @attributes["data-method"]

module.exports = Tower.View.Components
