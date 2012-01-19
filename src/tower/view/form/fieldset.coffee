class Tower.View.Form.Fieldset
  constructor: (options = {}) ->
    #super
    @[key] = value for key, value of options
    #@label      = @localize("titles", options[:label], nil, (attributes[:locale_options] || {}).merge(:allow_blank => true)) if options[:label].present?
  
    #merge_class! attributes, *[
    #  config.fieldset_class
    #]
    @attributes = attributes = {}
    
    #attributes.id ||= label.underscore.strip.gsub(/[_\s]+/, config.separator) if label.present?
    
    delete attributes.index
    delete attributes.parentIndex
    delete attributes.label
    
    @builder     = new Tower.View.Form.Builder(
      template:     @template
      model:        @model
      attribute:    @attribute
      index:        @index
      parentIndex: @parentIndex
    )
    
  tag: (key, args...) ->
    @template.tag key, args
    
  # form.inputs :basic_info, :locale_options => {:count => 1, :past => true}
  render: (block) ->
    @tag "fieldset", @attributes, =>
      if @label
        @tag "legend", class: "legend", =>
          @tag "span", @label
      @tag "ol", class: "fields", =>
        @builder.render(block)
    
module.exports = Tower.View.Form.Fieldset
