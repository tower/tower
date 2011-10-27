class Concern  
  @included: ->
    @_dependencies ?= []
    @extend   @ClassMethods if @hasOwnProperty("ClassMethods")
    @include  @InstanceMethods if @hasOwnProperty("InstanceMethods")
  
  # Module.append_features in ruby
  @_appendFeatures: ->
  
module.exports = Concern
