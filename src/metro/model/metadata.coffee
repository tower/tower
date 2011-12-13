Metro.Model.Metadata =
  ClassMethods:
    baseClass: ->
      
    stiName: ->  
      
    toParam: ->
      Metro.Support.String.parameterize(@className())

  toLabel: ->
    @className()

  toPath: ->
    @constructor.toParam() + "/" + @toParam()

  toParam: ->
    @get("id").toString()

module.exports = Metro.Model.Metadata
