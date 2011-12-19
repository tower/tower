Coach.Model.Metadata =
  ClassMethods:
    baseClass: ->
      if @__super__ && @__super__.constructor.baseClass && @__super__.constructor != Coach.Model
        @__super__.constructor.baseClass()
      else
        @
      
    stiName: ->
      
    toParam: ->
      Coach.Support.String.parameterize(@className())

  toLabel: ->
    @className()

  toPath: ->
    @constructor.toParam() + "/" + @toParam()

  toParam: ->
    @get("id").toString()

module.exports = Coach.Model.Metadata
