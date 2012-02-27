class Tower.View.Form.Builder extends Tower.View.Component
  constructor: (args, options = {}) ->
    @template       = options.template
    @model          = options.model
    @attribute      = options.attribute
    @parentIndex    = options.parentIndex
    @index          = options.index
    @tabindex       = options.tabindex
    @accessKeys     = options.accessKeys
    #@attributes     = @cloneAttributes(options.except(:template, :model, :attribute, :accessKeys, :index, :tabindex))
    
  defaultOptions: (options = {}) ->
    options.model     ||= @model
    options.index     ||= @index
    options.attribute ||= @attribute
    options.template  ||= @template
    options
  
  fieldset: (args...) ->  
    block                   = args.pop()
    options                 = @defaultOptions(Tower.Support.Array.extractOptions(args))
    options.label           ||= args.shift()
    
    new Tower.View.Form.Fieldset([], options).render(block)
    
  fields: ->
    args              = Tower.Support.Array.args(arguments)
    block             = Tower.Support.Array.extractBlock(args)
    options           = Tower.Support.Array.extractOptions(args)
    options.as        = "fields"
    options.label   ||= false
    attribute         = args.shift() || @attribute
    console.log "FIELDS"
    @field attribute, options, (_field) =>
      @fieldset(block)
      
  fieldsFor: ->
    options        = args.extractOptions
    attribute      = args.shift
    macro          = model.macroFor(attribute)
    attrName      = nil
    
    if options.as == "object"
      attrName = attribute.toS
    else
      attrName = if Tower.View.renameNestedAttributes then "#{attribute}_attributes" else attribute.toS

    # -> something here for counts
    subParent     = model.object
    subObject     = args.shift
  
    index          = options.delete("index")
  
    unless index.present? && typeof index == "string"
      if subObject.blank? && index.present?
        subObject   = subParent.send(attribute)[index]
      else if index.blank? && subObject.present? && macro == "hasMany"
        index        = subParent.send(attribute).index(subObject)

    subObject   ||= model.default(attribute) || model.toS.camelize.constantize.new
    keys           = [model.keys, attrName]
    
    options.merge(
      template:    template
      model:       model
      parentIndex: index
      accessKeys:  accessKeys
      tabindex:    tabindex
    )
    
    new Tower.View.Form.Builder(options).render(block)

  field: ->  
    args          = Tower.Support.Array.args(arguments)
    last          = args[args.length - 1]
    args.pop() if last == null || last == undefined
    block         = Tower.Support.Array.extractBlock(args)
    options       = Tower.Support.Array.extractOptions(args)
    attributeName = args.shift() || "attribute.name"
    #attribute      = Storefront:"Attribute".new(
    #  name:     attributeName,
    #  model:    @model, 
    #  required: options.required == true, 
    #  disabled: options.disabled == true,
    #  topLevel: options.attribute == false
    #)
    
    defaults = 
      template:    @template
      model:       @model
      attribute:   attributeName, 
      parentIndex: @parentIndex
      index:       @index
      fieldHTML:   options.fieldHTML || {}
      inputHTML:   options.inputHTML || {}
      labelHTML:   options.labelHTML || {}
      errorHTML:   options.errorHTML || {}
      hintHtml:    options.hintHtml  || {}
    
    new Tower.View.Form.Field([], _.extend(defaults, options)).render(block)

  button: ->
    args          = Tower.Support.Array.args(arguments)
    block         = Tower.Support.Array.extractBlock(args)
    options       = Tower.Support.Array.extractOptions(args)
    options.as  ||= "submit"
    options.value = args.shift() || "Submit"
    options.class = Tower.View.submitFieldsetClass if options.as == "submit"
    @field options.value, options, block
  
  submit: @::button

  partial: (path, options = {}) ->
    @template.render partial: path, locals: options.merge(fields: self)

  tag: (key, args...) ->
    @template.tag key, args
    
  render: (block) ->
    block(@)