class Tower.View.Form.Field extends Tower.View.Component
  constructor: (args, options) ->
    super
    
    # input type
    options.as    ||= attribute.inputType(options)
    @inputType      = inputType = options.as
    @inputs         = []
    
    # class
    classes = [Tower.View.fieldClass, inputType]
    
    unless ["submit", "fieldset"].indexOf(inputType) > -1
      classes.push if attribute.required then Tower.View.requiredClass else Tower.View.optionalClass
      classes.push if attribute.errors then Tower.View.errorClass else Tower.View.validClass
      
      if options.validate != false && attribute.validations.present?
        classes.push Tower.View.validateClass
    
    attributes.class = @addClass attributes.class, classes
    
    # id
    if attributes.id? && Tower.View.idEnabledOn.indexOf("field") > -1
      attributes.id = attribute.toId(type: "field", index: index, parentIndex: parentIndex)
    
    unless ["hidden", "submit"].indexOf(inputType) > -1
      # errors
      @errors           = options.slice("richInput", "errorHtml", "error", "model", "index", "parentIndex", "attribute", "template")
    
      # label
      @label            = options.slice("richInput", "labelHtml", "label", "model", "index", "parentIndex", "attribute", "template")
    
      # hint
      @hints            = options.slice("richInput", "hintHtml", "hint", "model", "index", "parentIndex", "attribute", "template")
    
    unless inputType == "fieldset"
      # inputs
      @inputAttributes = defaultOptions.merge(attributes.except("id", "class", "fieldHtml", "attributes", "errorHtml", "labelHtml", "hintHtml"))
    
    mergeClass options.fieldHtml.class, attributes.class
    
    @attributes       = options.fieldHtml.merge(id: attributes.id)
  
  input: (args...) ->
    options = args.extractOptions
    key     = args.shift || attribute.name
    @inputs.push inputFor(inputType, key, options)
    
  render: (block) ->
    @tag Tower.View.fieldTag, @attributes, =>
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
    Tower.View.Form.Input.find(key).new(@inputAttributes.merge(options))
  
  extractElements: (options = {}) ->
    elements = []
    if ["hidden", "submit"].include?(inputType)
      elements.push "inputs"
    else
      if @label.present? && @label.value?
        elements.push "label"
      elements = elements.concat ["inputs", "hints", "errors"]
    elements
