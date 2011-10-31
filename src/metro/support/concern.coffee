class Metro.Support.Concern  
  constructor: -> super
  
  @included: ->
    @_dependencies ?= []
    @extend   @ClassMethods if @hasOwnProperty("ClassMethods")
    @include  @InstanceMethods if @hasOwnProperty("InstanceMethods")
  
  # Module.appendFeatures in ruby
  @_appendFeatures: ->
  
module.exports = Metro.Support.Concern
