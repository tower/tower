class Tower.View.Form.Fieldset extends Tower.View.Component
  constructor: (args, options) ->
    super
    #@label      = @localize("titles", options[:label], nil, (attributes[:locale_options] || {}).merge(:allow_blank => true)) if options[:label].present?
    
    #merge_class! attributes, *[
    #  config.fieldset_class
    #]
    @attributes = attributes = {}
    
    #attributes.id ||= label.underscore.strip.gsub(/[_\s]+/, config.separator) if label.present?
    
    delete attributes.index
    delete attributes.parentIndex
    delete attributes.label
    
    @builder     = new Tower.View.Form.Builder([], 
      template:     @template
      model:        @model
      attribute:    @attribute
      index:        @index
      parentIndex:  @parentIndex
    )
  
  # form.inputs :basic_info, :locale_options => {:count => 1, :past => true}
  render: (block) ->
    @tag "fieldset", @attributes, =>
      if @label
        @tag "legend", class: Tower.View.legendClass, =>
          @tag "span", @label
      @tag Tower.View.fieldListTag, class: Tower.View.fieldListClass, =>
        @builder.render(block)

module.exports = Tower.View.Form.Fieldset
