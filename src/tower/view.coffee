class Tower.View extends Tower.Class
  @extend
    engine:         "coffee"
    prettyPrint:    false
    loadPaths:      ["app/views"]
    store: (store) ->
      @_store = store if store
      @_store ||= new Tower.Store.Memory(name: "view")
  
  constructor: (context = {}) ->
    @_context = context

require './view/helpers'
require './view/rendering'
require './view/table'
require './view/form'
require './view/helpers/assetHelper'
require './view/helpers/componentHelper'
require './view/helpers/dateHelper'
require './view/helpers/headHelper'
require './view/helpers/numberHelper'
require './view/helpers/stringHelper'

Tower.View.include Tower.View.Rendering
Tower.View.include Tower.View.Helpers
Tower.View.include Tower.View.AssetHelper
Tower.View.include Tower.View.ComponentHelper
Tower.View.include Tower.View.DateHelper
Tower.View.include Tower.View.HeadHelper
Tower.View.include Tower.View.NumberHelper
Tower.View.include Tower.View.StringHelper

module.exports = Tower.View
