class Concern  
  constructor: -> super
  
  @included: ->
    @_dependencies ?= []
    @extend   @ClassMethods if @hasOwnProperty("ClassMethods")
    @include  @InstanceMethods if @hasOwnProperty("InstanceMethods")
  
  # Module.appendFeatures in ruby
  @_appendFeatures: ->
  
module.exports = Concern
