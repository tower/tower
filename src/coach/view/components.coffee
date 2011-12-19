###
Coach.View.Components =    
  formFor: ->
    form options.outerHTML, ->
      input type: "hidden", name: "_method", value: options.outerHTML["data-method"]
      
  formOptions: ->
    attributes                 = options.html || {}
    attributes.action        = options.url
    attributes.class         = options.class if options.hasKey?(:class)
    mergeClass! attributes, config.formClass
    attributes.id            = options.id if options.hasKey?(:id)
    #attributes.id            ||= 
    attributes.enctype       = "multipart/form-data" if (options.multipart || attributes.delete(:multipart)).toS == "true"
    attributes.role          = :form
    attributes.novalidate    = "true" # needs to be true b/c the error popups are horribly ugly!# if options.validate == false
    attributes[:"data-validate"] = options.validate.toS if options.hasKey?(:validate)
  
    method                     = attributes.method || options.method
  
    if method.blank?
      if @model.newRecord?
        method                 = :put
      else
        method                 = :post
      end
    end
  
    attributes[:"data-method"] = method
    attributes.method        = method == :get ? :get : :post

    attributes
    
  _label: ->
    label, attributes, ->
      span value
      if attribute.required
        abbr config.requiredAbbr, title: config.requiredTitle, class: config.requiredClass
      else
        abbr config.optionalAbbr, title: config.optionalTitle, class: config.optionalClass
  
  _input: ->
  
  _inputOptions: ->
    # input type
    options.as  ||= attributeInputType(options)
    inputType     = options.as
    includeBlank  = options.includeBlank != false
    value         = options.value
    dynamic       = options.dynamic == true
    richInput     = options.hasOwnProperty("richInput") ? !!options.richInput : config.richInput
  
    validate      = attributes["validate"] != false
  
    classes = [inputType, self.class.name.split("::").last.underscore, attribute.name.toS.underscore.strip.gsub(/[_\s]+/, config.separator)]
  
    if options.inputHTML
      classes << options.inputHtml.delete(:class)
  
    unless submit.include?(inputType)
      classes += [
        attribute.required? ? config.requiredClass : config.optionalClass, 
        attribute.errors? ? config.errorClass : config.validClass,
        "input"
      ]
    
      if @validate && attribute.validations.present?
        classes << config.validateClass
  
    # class
    mergeClass attributes, *classes.compact.uniq.map(&:toS)
  
    # id
    attributes.id ||= attribute.toId(:index => index, :parentIndex => parentIndex) if config.idEnabledOn.include?("input")
  
    # validations
    if validate
      attributes.merge!(attributeValidations()) if config.inlineValidations && attribute.validations.present?  
    attributes.placeholder = options.placeholder if options.placeholder.present?
  
    # name
    attributes.name     ||= attribute.toParam(:index => index, :parentIndex => parentIndex)
  
    # value
    attributes.value    ||= attribute.value(options.value)
  
    # attributes.tabindex      = @tabindex
    attributes.maxlength       = options.max if options.max.present?
  
    # expressions
    pattern                      = options.match
    pattern                      = pattern.source if pattern.isA?(::Regexp)
    attributes["data-match"]    = pattern if pattern.present?
    attributes["aria-required"] = attribute.required.toS if attribute.required?
  
    # access key
    accessKey                   = attributes.accesskey || attribute.accessKey
    attributes.accesskey       = accessKey
  
    attributes.merge!(options.inputHtml) if options.inputHtml
  
    attributes.delete :includeBlank
    attributes.delete :inputHtml
    attributes.delete :includeTemplate
    attributes.delete :as
    attributes.delete :dynamic
    attributes.delete :parentIndex
  
    attributes.required = "true" if attributes.delete(:required) == true
    attributes.disabled = "true" if attributes.delete(:disabled) == true
    attributes.autofocus = "true" if attributes.delete(:autofocus) == true
    attributes["data-dynamic"] = "true" if @dynamic
  
    attributes.title ||= attributes.placeholder if attributes.placeholder.present?
    
    autocomplete = attributes.delete(:autocomplete)
    
    if autocomplete && config.includeAria
      attributes["aria-autocomplete"] = case autocomplete
      when "inline", "list", "both"
        autocomplete
      else
        "both"
    
  _selectInput: ->
    
  _textInput: ->
    
  _field: ->
    li attributes, ->
      input attribute.name unless blockGiven?
      elements = extractElements!(attributes)
    
      result = elements.map (element) ->
        Array(send(element)).map(render)
      
      result.flatten.join.gsub(/\n$/, "") if result.present?
    
      yield(self) if blockGiven?
    
  _hint: ->
    
  _error: ->
    output class: 'error'
    
  _fieldset: ->
    fieldset options.outerHTML, ->
      legend ->
        span options.label
      tag options.tag, options.innerHTML, options.callback
  
  menuOptions: ->
    options = extractOptions(arguments)
    
    options.tag ||= "ol"
    options.innerHTML ||= {}
    options.outerHTML ||= {}
    
    if config.aria
      options.outerHTML.role = "menu"
      options.innerHTML.role = "list"
      
    mergeClass options.innerHTML, "list"
    
    options
  
  extractOptions: (args, index = 0) ->
    args      = Array.prototype.slice.call(args, index, index + 2)
    callback  = args.pop() if typeof args[args.length - 1] == "function"
    options   = args.pop() if typeof args[args.length - 1] == "object"
    options ||= {}
    
    options.callback = callback
    
    options
  
  _menu: ->
    options = menuOptions.call @, arguments
    
    nav options.outerHTML, ->
      # header = template.headerWidget(options)
      # template.hamlConcat header if header.present?
      
      tag options.tag, options.innerHTML, options.callback
      
      #if options.footerHtml.present?
      #  template.footerWidget(options.footerHtml)
    
  _menuItem: (label, path) ->
    options   = menuItemOptions.call @, arguments
    callback  = options.callback
    
    tag options.tag, options.outerHTML, ->
      if callback
        callback.call @, options.value
      else if options.current && options.as == "span"
        span options.value, options.innerHTML
      else
        linkTo options.value, options.path, options.innerHTML
      span options.separator if options.separator
###