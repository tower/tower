Tower.Model.Metadata =
  ClassMethods:
    baseClass: ->
      if @__super__ && @__super__.constructor.baseClass && @__super__.constructor != Tower.Model
        @__super__.constructor.baseClass()
      else
        @
      
    stiName: ->
      
    toParam: ->
      Tower.Support.String.parameterize(@className())

  toLabel: ->
    @className()

  toPath: ->
    @constructor.toParam() + "/" + @toParam()

  toParam: ->
    @get("id").toString()

module.exports = Tower.Model.Metadata
