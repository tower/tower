class Tower.ViewForm extends Tower.ViewComponent
  constructor: (args, options) ->
    super
    @model      = args.shift() || new Tower.Model

    if typeof @model == "string"
      klass     = try Tower.constant(Tower.SupportString.camelize(@model))
      @model    = new klass if klass

    @attributes = @_extractAttributes(options)

  render: (callback) ->
    @tag "form", @attributes, =>
      @tag "input", type: "hidden", name: "_method", value: @attributes["data-method"]
      # @tag "input", type: "hidden", name: "format", value: 'html'
      if callback
        builder    = new Tower.ViewFormBuilder([],
          template:   @template
          tabindex:   1
          accessKeys: {}
          model:      @model
          live:       @live
        )
        builder.render(callback)

  # @private
  _extractAttributes: (options = {}) ->
    attributes                  = options.html || {}
    attributes.action           = options.url || Tower.urlFor(@model)
    attributes.class            = options["class"] if options.hasOwnProperty("class")
    #@mergeClass attributes, config.formClass
    attributes.id               = options.id if options.hasOwnProperty("id")
    attributes.id             ||= Tower.SupportString.parameterize("#{@model.constructor.className()}-form")
    attributes.enctype          = "multipart/form-data" if (options.multipart || attributes.multipart == true)
    attributes.role             = "form"
    attributes.novalidate       = "true" # needs to be true b/c the error popups are horribly ugly!# if options.validate == false
    attributes["data-validate"] = options.validate.toString() if options.hasOwnProperty("validate")

    method                      = attributes.method || options.method

    if !method || method == ""
      if @model && @model.get("id")
        method                 = "put"
      else
        method                 = "post"

    attributes["data-method"] = method
    attributes.method        = if method == "get" then "get" else "post"

    attributes

require './form/builder'
require './form/field'
require './form/fieldset'

module.exports = Tower.ViewForm