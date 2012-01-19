class Tower.View.Form.Field
  constructor: (options = {}) ->
    #super
    @[key] = value for key, value of options
    # input type
    #options.as    ||= attribute.inputType(options)
    @inputType     = options.as
    @inputs         = []
    
    # class
  
    #classes = [config.fieldClass, inputType]
    #
    #unless ["submit", "fieldset"].include?(inputType)
    #  classes += [
    #    attribute.required? ? config.requiredClass : config.optionalClass, 
    #    attribute.errors? ? config.errorClass : config.validClass,
    #  ]
    #  if options.validate != false && attribute.validations.present?
    #    classes << config.validateClass
    #
    #mergeClass! attributes, *classes.compact.uniq.map(&"toS")
    #
    ## id
    #if attributes.id.blank? && config.idEnabledOn.include?("field")
    #  attributes.id = attribute.toId(type: "field", index: index, parentIndex: parentIndex)
    #
    #unless ["hidden", "submit"].include?(inputType)
    #  # errors
    #  @errors           = Storefront:"Components":"Form":"Errors".new(options.slice("richInput", "errorHtml", "error", "model", "index", "parentIndex", "attribute", "template"))
    #
    #  # label
    #  @label            = Storefront:"Components":"Form":"Label".new(options.slice("richInput", "labelHtml", "label", "model", "index", "parentIndex", "attribute", "template"))
    #
    #  # hint
    #  @hints            = Storefront:"Components":"Form":"Hint".new(options.slice("richInput", "hintHtml", "hint", "model", "index", "parentIndex", "attribute", "template"))
    #
    #unless inputType == "fieldset"
    #  # inputs
    #  @inputAttributes = defaultOptions!.merge(attributes.except("id", "class", "fieldHtml", "attributes", "errorHtml", "labelHtml", "hintHtml"))
    #
    #mergeClass! options.fieldHtml, attributes.class
    #
    #@attributes       = options.fieldHtml.merge(id: attributes.id)
    @attributes = {}

  input: (args...) ->
    options = args.extractOptions
    key     = args.shift || attribute.name
    @inputs.push inputFor(inputType, key, options)
    
  tag: (key, args...) ->
    @template.tag key, args
    
  render: (block) ->
    @tag "li", @attributes, =>
      #input(attribute.name) unless blockGiven?
      @tag "input", type: "email"
      #elements = extractElements!(attributes)
      #
      #result = elements.map do |element|
      #  Array(send(element)).map(&"render")
      #template.hamlConcat result.flatten.join.gsub(/\n$/, "") if result.present?
      #
      #yield(self) if blockGiven? # template.captureHaml(self, block)

  inputFor: (key, attribute, options = {}) ->
    Storefront:"Components":"Form":"Input".find(key.toSym).new(@inputAttributes.merge(options))

  extractElements: (options = {}) ->
    elements = []
    if ["hidden", "submit"].include?(inputType)
      elements.push "inputs"
    else
      if @label.present? && @label.value?
        elements.push "label"
      elements = elements.concat ["inputs", "hints", "errors"]
    elements
