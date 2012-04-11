class Tower.View.Form.Field extends Tower.View.Component
  addClass: (string, args) ->
    result = if string then string.split(/\s+/g) else []
    for arg in args
      continue unless arg
      result.push(arg) unless result.indexOf(arg) > -1
    result.join(" ")

  toId: (options = {}) ->
    result = Tower.Support.String.parameterize(@model.constructor.name)#@model.toKey()
    result += "-#{options.parentIndex}" if options.parentIndex
    result += "-#{Tower.Support.String.parameterize(@attribute)}"
    result += "-#{options.type || "field"}"
    result += "-#{@index}" if @index?
    result

  toParam: (options = {}) ->
    result = Tower.Support.String.parameterize(@model.constructor.name)#@model.toKey()
    result += "[#{options.parentIndex}]" if options.parentIndex
    result += "[#{@attribute}]"
    result += "[#{@index}]" if @index?
    result

  constructor: (args, options) ->
    @labelValue = options.label
    delete options.label

    super(args, options)

    @required ||= false

    # input type
    
    field           = @model.constructor.fields()[@attribute]

    options.as    ||= if field then Tower.Support.String.camelize(field.type, true) else "string"
    @inputType      = inputType = options.as
    @required       = !!(field && field.required == true)

    # class
    classes = [Tower.View.fieldClass, inputType]
    unless ["submit", "fieldset"].indexOf(inputType) > -1
      classes.push if field.required then Tower.View.requiredClass else Tower.View.optionalClass
      classes.push if field.errors then Tower.View.errorClass else Tower.View.validClass

      if options.validate != false && field.validations
        classes.push Tower.View.validateClass

    @fieldHTML.class = @addClass @fieldHTML.class, classes

    # id
    if !@fieldHTML.id && Tower.View.idEnabledOn.indexOf("field") > -1
      @fieldHTML.id = @toId(type: "field", index: @index, parentIndex: @parentIndex)

    @inputHTML.id = @toId(type: "input", index: @index, parentIndex: @parentIndex)
    unless ["hidden", "submit"].indexOf(inputType) > -1
      @labelHTML.for ||= @inputHTML.id
      @labelHTML.class = @addClass @labelHTML.class, [Tower.View.labelClass]

      unless @labelValue == false
        @labelValue ||= Tower.Support.String.camelize(@attribute.toString())

      unless options.hint == false
        @errorHTML.class = @addClass @errorHTML.class, [Tower.View.errorClass]
        if Tower.View.includeAria && Tower.View.hintIsPopup
          @errorHTML.role ||= "tooltip"

    @attributes       = @fieldHTML

    @inputHTML.name ||= @toParam() unless inputType == "submit"

    @value          = options.value
    @dynamic        = options.dynamic == true
    @richInput      = if options.hasOwnProperty("rich_input") then !!options.rich_input else Tower.View.richInput

    @validate       = options.validate != false

    classes         = [inputType, Tower.Support.String.parameterize(@attribute), @inputHTML.class]

    unless ["submit", "fieldset"].indexOf(inputType) > -1
      classes.push if field.required then Tower.View.requiredClass else Tower.View.optionalClass
      classes.push if field.errors then Tower.View.errorClass else Tower.View.validClass
      classes.push "input"

      if options.validate != false && field.validations
        classes.push Tower.View.validateClass

    # class
    @inputHTML.class = @addClass @inputHTML.class, classes
    @inputHTML.placeholder = options.placeholder if options.placeholder

    # value
    unless @inputHTML.value?
      value = undefined
      
      if options.hasOwnProperty("value")
        value = options.value
      if @inputHTML.hasOwnProperty('value')
        value = @inputHTML.value
      else
        value = @model.get(@attribute)
        value = value if value
      
      if value
        if @inputType == "array"
          value = _.castArray(value).join(", ")
        else
          value = value.toString()
        
        @inputHTML.value = value

    # @inputHTML[:tabindex]      = @tabindex
    @inputHTML.maxlength    ||= options.max if options.hasOwnProperty("max")

    # expressions
    pattern                       = options.match
    pattern                       = pattern.toString() if _.isRegExp(pattern)
    @inputHTML["data-match"]      = pattern if pattern?
    @inputHTML["aria-required"]   = @required.toString()

    @inputHTML.required = "true" if @required == true
    @inputHTML.disabled = "true" if @disabled
    @inputHTML.autofocus = "true" if @autofocus == true
    @inputHTML["data-dynamic"] = "true" if @dynamic

    @inputHTML.title ||= @inputHTML.placeholder if @inputHTML.placeholder

    @autocomplete = @inputHTML.autocomplete == true

    if @autocomplete && Tower.View.includeAria
      @inputHTML["aria-autocomplete"] = switch @autocomplete
        when "inline", "list", "both"
          @autocomplete
        else
          "both"

  input: (args...) ->
    options = _.extend @inputHTML, _.extractOptions(args)
    key     = args.shift() || @attribute
    @["#{@inputType}Input"](key, options)

  checkboxInput: (key, options) ->
    @tag "input", _.extend(type: "checkbox", options)

  stringInput: (key, options) ->
    @tag "input", _.extend(type: "text", options)

  submitInput: (key, options) ->
    value = options.value
    delete options.value
    @tag "button", _.extend(type: "submit", options), value

  fileInput: (key, options) ->
    @tag "input", _.extend(type: "file", options)

  textInput: (key, options) ->
    value = options.value
    delete options.value
    @tag "textarea", options, value

  passwordInput: (key, options) ->
    @tag "input", _.extend(type: "password", options)

  emailInput: (key, options) ->
    @tag "input", _.extend(type: "email", options)

  urlInput: (key, options) ->
    @tag "input", _.extend(type: "url", options)

  numberInput: (key, options) ->
    @tag "input", _.extend(type: "string", "data-type": "numeric", options)

  searchInput: (key, options) ->
    @tag "input", _.extend(type: "search", "data-type": "search", options)

  phoneInput: (key, options) ->
    @tag "input", _.extend(type: "tel", "data-type": "phone", options)

  arrayInput: (key, options) ->
    @tag "input", _.extend("data-type": "array", options)

  label: ->
    return unless @labelValue
    @tag "label", @labelHTML, =>
      @tag "span", @labelValue
      if @required
        @tag "abbr", title: Tower.View.requiredTitle, class: Tower.View.requiredClass, -> Tower.View.requiredAbbr
      else
        @tag "abbr", title: Tower.View.optionalTitle, class: Tower.View.optionalClass, -> Tower.View.optionalAbbr

  render: (block) ->
    @tag Tower.View.fieldTag, @attributes, =>
      if block
        block.call @
      else
        @label()
        if @inputType == "submit"
          @input()
        else
          @tag "div", class: "controls", =>
            @input()

      #elements = extractElements!(attributes)
      #
      #result = elements.map do |element|
      #  Array(send(element)).map(&"render")
      #template.hamlConcat result.flatten.join.gsub(/\n$/, "") if result.present?
      #
      #yield(self) if blockGiven? # template.captureHaml(self, block)

  extractElements: (options = {}) ->
    elements = []
    if ["hidden", "submit"].include?(inputType)
      elements.push "inputs"
    else
      if @label.present? && @label.value?
        elements.push "label"
      elements = elements.concat ["inputs", "hints", "errors"]
    elements